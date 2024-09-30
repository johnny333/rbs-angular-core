# `ApplicationError`

Błąd aplikacji:

    class ApplicationError extends Error

      constructor: (@status, @code, @message) ->

# `ErrorFactory`

Fabryka błędów aplikacji:

    class ErrorFactory

      @create: (status, code, message) -> new ApplicationError(status, code, message)

      @throw: (status, code, message) -> throw ErrorFactory.create(status, code, message)

    (angular.module '<%= package.name %>').constant 'ErrorFactory', ErrorFactory