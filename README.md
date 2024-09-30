# rbs-angular-core

Moduł podstawowy dla aplikacji **Angular.js**.

## Instalacja

    npm install
    bower install

## Instalacja w projekcie

    npm install coffeescript-mixins --save-dev
    bower install git@gitlab.bssolutions.pl:biblioteki/rbs-angular-core.git#v0.0.1 string bignumber.js lodash --save

## API

### `ErrorFactory`

Usługa standaryzuje sposób tworzenia wyjątków aplikacji. Definiuje klasę `ApplicationError` zawierającą `status`, `code`, i `description` dla każdego wyjątku.

Zobacz dostępne [API](src/main/coffee/service/ErrorFactory.litcoffee) oraz [testy](src/test/unit/coffee/service/ErrorFactory_specs.litcoffee)

### `ConfigurationProvider`

Usługa umożliwia konfigurację parametrów aplikacji i modułów.

Zobacz dostępne [API](src/main/coffee/config/Configuration.litcoffee) oraz [testy](src/test/unit/coffee/config/Configuration_specs.litcoffee)

### `ActionCtrl`

Podstawowy kontroler akcji umożliwiający wpinanie dodatkowych funkcji w toku wykonywania akcji przez kontroler.

Zobacz dostępne [API](src/main/coffee/controller/ActionCtrl.litcoffee) oraz [testy](src/test/unit/coffee/controller/ActionCtrl_specs.litcoffee)

### `ActionMessagesSupport`

Mixin dodający obsługę listy notyfikacji do `ActionCtrl`.

Zobacz dostępne [API](src/main/coffee/controller/ActionMessagesSupport.litcoffee) oraz [testy](src/test/unit/coffee/controller/ActionMessagesSupport_specs.litcoffee)

### `ActionProgressSupport`

Mixin dodający obsługę flagi postępu do `ActionCtrl`.

Zobacz dostępne [API](src/main/coffee/controller/ActionProgressSupport.litcoffee) oraz [testy](src/test/unit/coffee/controller/ActionProgressSupport_specs.litcoffee)

### `Backoff`

Usługa umożliwia wywoływanie akcji zgodnie z algorytmem [exponential backoff](https://en.wikipedia.org/wiki/Exponential_backoff).

Zobacz dostępne [API](src/main/coffee/service/Backoff.litcoffee) oraz [testy](src/test/unit/coffee/service/Backoff_specs.litcoffee)

### `Resolves`

Usługa umożliwia tworzenie kombinacji kilku `resolve`.

Zobacz dostępne [API](src/main/coffee/service/Resolves.litcoffee) oraz [testy](src/test/unit/coffee/service/Resolves_specs.litcoffee)
