# ConfigurationProvider

Usługa umożliwia konfigurację parametrów aplikacji i modułów.

    PARAMETERS = {}

    class ConfigurationProvider

      $get: -> PARAMETERS

Pobiera parametr konfiguracyjny o podanej nazwie `name`:

      get: (name) -> PARAMETERS[name]

Nadpisuje parametr konfiguracyjny o podanej nazwie `name` wartością `value`:

      add: (name, value) ->
        entry = {}
        entry[name] = value
        angular.extend PARAMETERS, entry

Dołącza wartość `value` do parametru konfiguracyjnego o podanej nazwie `name` (działanie rózni się od metody `add`
w przypadku gdy wartością jest `object` - nowa wartość jest dołączona do istniejącej przy użyciu metody
`angular`.`merge`:

      put: (name, value) ->
        entry = {}
        entry[name] = value
        angular.merge PARAMETERS, entry

Alias metody `add`:

      set: (name, value) -> @add name, value

Alias metody `put`:

      merge: (name, value) -> @put name, value

    (angular.module '<%= package.name %>').provider 'Configuration', ConfigurationProvider
