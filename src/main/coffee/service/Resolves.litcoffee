# `Resolves`

    class Resolves

## `andThen`

Zakładając że mamy `resolve`:

```
resolve = [
  '$log'
  'ResourceA'
  ($log, ResourceA) -> ResourceA.query().$promise
]
```

i drugi - operujący na wyniku poprzedniego:

```
mapping = [
  '$delegate'
  'ResourceB'
  ($delegate, ResourceB) ->
    ResourceB.query(id: $delegate.id).$promise
]
```

tworzy

```
mapped = Resolves.andThen(resolve, mapping)
```

w postaci:

```
[
  '$q'
  '$log'
  'ResourceA'
  'ResourceB'
  ($q, $log, ResourceA, ResourceB) ->
    $q.when(ResourceA.query().$promise).then ($delegate) ->
      ResourceB.query(id: $delegate.id).$promise
]
```

      @andThen: (resolves, mapping, next...) ->
        dependencyNames = ['$q']
        fn1 = undefined
        fn2 = undefined
        [fn1Deps..., fn1] = resolves
        [fn2Deps..., fn2] = mapping

        delegateIndex = fn2Deps.indexOf '$delegate'

        if delegateIndex >= 0
          fn2Deps.splice delegateIndex, 1

        for dep in fn1Deps
          dependencyNames.push dep
        for dep in fn2Deps
          dependencyNames.push dep

        dependencyNames.push ($q, dependencies...) ->
          try
            newFn1Deps = dependencies[0...fn1Deps.length]
            $q.when(fn1 newFn1Deps...).then ($delegate) ->
              newFn2Deps = dependencies[fn1Deps.length...(fn1Deps.length + fn2Deps.length)]
              if delegateIndex >= 0
                newFn2Deps.splice delegateIndex, 0, $delegate
              fn2 newFn2Deps...
          catch error
            $q.reject error
        dependencyNames
        if next.length > 0
          Resolves.andThen dependencyNames, next...
        else dependencyNames

    (angular.module '<%= package.name %>').constant 'Resolves', Resolves
