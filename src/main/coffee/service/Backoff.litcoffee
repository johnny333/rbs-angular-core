# Backoff

Usługa umożliwia wywoływanie akcji zgodnie z algorytmem
[exponential backoff](https://en.wikipedia.org/wiki/Exponential_backoff).

    (angular.module '<%= package.name %>').service 'Backoff', [
      '$log'
      '$q'
      '$timeout'
      ($log, $q, $timeout) ->

        class Backoff

Parametry:
1. `name`: `string` - nazwa procesu (użyta w logach)
1. `minBackoff`: `number` - minimalny okres oczekiwania (ms)
1. `maxBackoff`: `number` - maksymalny okres oczekiwania (ms)
1. `randomFactor`: `number` - losowy współczynnik o jaki będzie powiększany czas oczekiwania [0.0, 1.0)
1. `task`: `function` - wywoływane zadanie


          constructor: (@name, @minBackoff, @maxBackoff, @randomFactor, @task) ->
            $log.debug("Creating #{@name}:", "minBackoff", @minBackoff, "maxBackoff", @maxBackoff, "randomFactor",
             @randomFactor)
            @$restartCount = 0

          cancel: () ->
            $log.debug("#{@name} cancelled.")
            if angular.isFunction(@$promise?.then)
              $timeout.cancel(@$promise)
            @$promise = undefined

          execute: (args...) ->
            $log.debug("#{@name} executing..")
            @$execute(args...).then ((result) => @$onSuccess(result, args...)), (error) => @$onFailure(error, args...)

          $onSuccess: (result, args...) ->
            $log.debug("#{@name} success.")
            @$restartCount = 0
            result

          $onFailure: (error, args...) ->
            rnd = 1 + Math.random() * @randomFactor
            @$currentBackoff = Math.min @maxBackoff, @minBackoff * Math.pow(2, @$restartCount) * rnd
            @$restartCount += 1
            $log.error("#{@name} failure! Retry in #{@$currentBackoff}..")
            @$promise = $timeout (() => @execute(args...)), @$currentBackoff, true
            @$promise

          $execute: (args...) ->
            @lastOutcome = try
              $q.when @task(args...)
            catch error
              $log.error error
              $q.reject error

        (args...) -> new Backoff(args...)
    ]

## Użycie

Poniższy kod powoduje próbę połączenia się z WebSocketem. Jeżeli połączenie się nie powiedzie będą podejmowane próby
kolejnego połączenia w rosnących odstępach czasu pomiędzy 10s a 2m.

    (angular.module '<%= package.name %>-samples').config [
      'ConfigurationProvider'
      (ConfigurationProvider) ->
        ConfigurationProvider.add 'WS_URL', 'ws://example.org/events'
        ConfigurationProvider.add 'WS_MIN_BACKOFF', 10 * 1000
        ConfigurationProvider.add 'WS_MAX_BACKOFF', 120 * 1000
    ]

    (angular.module '<%= package.name %>-samples').run [
      '$log'
      '$q'
      '$rootScope'
      '$websocket'
      'Backoff'
      'Configuration'
      ($log, $q, $rootScope, $websocket, Backoff, Configuration) ->

        onMessage = (event) ->
          message = JSON.parse(event.data)
          $rootScope.$broadcast 'ws-event', message

        min = Configuration.WS_MIN_BACKOFF
        max = Configuration.WS_WS_MAX_BACKOFF
        random = 0.2
        bo = Backoff "Event stream WS", min, max, random, ->
          deferred = $q.defer()
          ws = $websocket "#{WS_WS_URL}/event?"
          ws.onMessage onMessage
          ws.onClose (event) -> deferred.reject(event)
          deferred.promise
        bo.execute()
    ]
