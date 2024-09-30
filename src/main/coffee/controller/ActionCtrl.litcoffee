# `ActionCtrl`

Podstawowy kontroler akcji.

    (angular.module '<%= package.name %>').service 'ActionCtrl', [
      '$log'
      '$q'
      ($log, $q) ->

        class ActionCtrl

          constructor: (@modelName, @actionName) ->

## `performValid`

Wywołuje akcję z walidacją formularza `form`. Jeżeli walidacja się nie powiedzie wywołana zostanie metoda `onInvalid`.
W przeciwnym razie wywoływana jest metoda `perform`:

          performValid: (form, arg, args...) ->
            if form.$valid
              @perform(arg, args...)
            else
              @onInvalid(form, arg, args...)

          $toPromise: (fn) ->
            try
              $q.when fn()
            catch error
              $q.reject error

## `perform`

Wywołuje akcję. Workflow akcji:
1. `preProcess`
1. `execute`
1. `postProcess`
1. `onComplete`
1. `onSuccess` lub `onFailure`

Każdą z metod można nadpisac. W ciele metod dozwolone jest rzucanie wyjątków, jak również zwracanie `promise`. W obydwu
przypadkach metoda `perform` zwróci na końcu `promise`. Wszystkie metody mają domyślne implementacje.

          perform: (arg, args...) ->
            preProcess = => @$toPromise => @preProcess arg, args...
            execute = (arg) => @$toPromise => @execute arg, args...
            postProcess = (result, arg) => @$toPromise => @postProcess result, arg, args...
            onCompleteSuccess = (result, arg) =>
              @$toPromise(=> @onComplete result, arg, args...).then () -> result
            onCompleteFailure = (error, arg) =>
              @$toPromise(=> @onComplete error, arg, args...).then () -> $q.reject(error)
            onSuccess = (result, arg) => @$toPromise => @onSuccess result, arg, args...
            onFailure = (error, arg) => @$toPromise => @onFailure error, arg, args...

            workflow = (arg) ->
              execute(arg)
                .then(((outcome) -> onCompleteSuccess(outcome, arg)), (error) -> onCompleteFailure(error, arg))
                .then(((result) -> postProcess(result, arg)))
                .then(((result) -> onSuccess(result, arg)))
                .catch (error) -> onFailure(error, arg)

            preProcess().then workflow, (error) ->
              onCompleteFailure(error, arg).then ((result) -> onSuccess(result, arg)), (error) -> onFailure(error, arg)

### `preProcess` ###

Umożliwia modyfikację modelu przed przekazaniem go do metody `execute`. Zwrócona wartość zostanie przekazana jako model
do metody `execute`. Rzucony wyjątek lub błędny `promise` zostanie przekazany od razu do metody `onFailure`
jako `error` wraz z oryginalnym modelem.

          preProcess: (arg, args...) ->
            $log.debug 'preProcess', @actionName, @modelName, arg, args...
            arg

### `execute` ###

Wykonuje akcję:

          execute: (arg, args...) ->
            $log.debug 'execute', @actionName, @modelName, arg, args...
            $q.reject("Execute acttion not implemented!")

### `postProcess` ###

Umożliwia modyfikację rezultatu metody `execute`. Zwrócona wartość zostanie przekazana jako wynik akcji.
Rzucony wyjątek lub błędny `promise` zostanie przekazany do metody `onFailure` jako `error` wraz z modelem.

          postProcess: (arg, args...) ->
            $log.debug 'postProcess', @actionName, @modelName, arg, args...
            arg

### `onComplete` ###

Metoda wywoływana jest zawsze po metodzie execute niezależnie od rezultatu jej wykonania. `outcome` będzie obiektem
błędu lub rezultatem wykonania.

          onComplete: (outcome, arg, args...) ->
            $log.debug 'onComplete', @actionName, @modelName, outcome, arg, args...

### `onSuccess` ###

Obsługa powodzenia akcji:

          onSuccess: (result, arg, args...) ->
            $log.debug 'onSuccess', @actionName, @modelName, result, arg, args...
            result

### `onFailure` ###

Obsługa niepowodzenia akcji:

          onFailure: (error, arg, args...) ->
            $log.error 'onFailure', @actionName, @modelName, error, arg, args...
            $q.reject(error)

### `onInvalid` ###

Obsługa niepoprawnych danych formularza:

          onInvalid: (form, arg, args...) ->
            $log.debug 'onInvalid', @actionName, @modelName, form, arg, args...
            $q.reject(form)

        ActionCtrl
    ]
