# `ActionMessagesSupport`

Mixin dodający obsługę listy notyfikacji do `ActionCtrl`.

    (angular.module '<%= package.name %>').service 'ActionMessagesSupport', [
      '$log'
      '$q'
      ($log, $q) ->

        class ActionMessagesSupport

          resetMessages: () ->
            @messages = []

          addMessage: (type, message) ->
            (@messages or @resetMessages()).push
              type: type
              message: message

          addError: (error) -> @addMessage 'danger', error

          addSuccess: (success) -> @addMessage 'success', success

          addInfo: (info) -> @addMessage 'info', info

          addWarning: (warning) -> @addMessage 'warning', warning

          removeMessage: (index) ->
            @messages.splice index, 1

        ActionMessagesSupport
    ]
