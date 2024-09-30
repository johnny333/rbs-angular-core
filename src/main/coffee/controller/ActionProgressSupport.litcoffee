# `ActionProgressSupport`

Mixin dodający obsługę flagi postępu do `ActionCtrl`.

    (angular.module '<%= package.name %>').service 'ActionProgressSupport', [
      '$log'
      '$q'
      ($log, $q) ->

        class ActionProgressSupport

          startProgress: () ->
            @progress = true

          stopProgress: () ->
            @progress = false

        ActionProgressSupport
    ]
