(function() {
  angular.module('rbs-angular-core', []);

  angular.module('rbs-angular-core-samples', ['rbs-angular-core']);

}).call(this);

(function() {
  var Resolves,
    slice = [].slice;

  Resolves = (function() {
    function Resolves() {}

    Resolves.andThen = function() {
      var delegateIndex, dep, dependencyNames, fn1, fn1Deps, fn2, fn2Deps, i, j, k, l, len, len1, mapping, next, resolves;
      resolves = arguments[0], mapping = arguments[1], next = 3 <= arguments.length ? slice.call(arguments, 2) : [];
      dependencyNames = ['$q'];
      fn1 = void 0;
      fn2 = void 0;
      fn1Deps = 2 <= resolves.length ? slice.call(resolves, 0, i = resolves.length - 1) : (i = 0, []), fn1 = resolves[i++];
      fn2Deps = 2 <= mapping.length ? slice.call(mapping, 0, j = mapping.length - 1) : (j = 0, []), fn2 = mapping[j++];
      delegateIndex = fn2Deps.indexOf('$delegate');
      if (delegateIndex >= 0) {
        fn2Deps.splice(delegateIndex, 1);
      }
      for (k = 0, len = fn1Deps.length; k < len; k++) {
        dep = fn1Deps[k];
        dependencyNames.push(dep);
      }
      for (l = 0, len1 = fn2Deps.length; l < len1; l++) {
        dep = fn2Deps[l];
        dependencyNames.push(dep);
      }
      dependencyNames.push(function() {
        var $q, dependencies, error, error1, newFn1Deps;
        $q = arguments[0], dependencies = 2 <= arguments.length ? slice.call(arguments, 1) : [];
        try {
          newFn1Deps = dependencies.slice(0, fn1Deps.length);
          return $q.when(fn1.apply(null, newFn1Deps)).then(function($delegate) {
            var newFn2Deps;
            newFn2Deps = dependencies.slice(fn1Deps.length, fn1Deps.length + fn2Deps.length);
            if (delegateIndex >= 0) {
              newFn2Deps.splice(delegateIndex, 0, $delegate);
            }
            return fn2.apply(null, newFn2Deps);
          });
        } catch (error1) {
          error = error1;
          return $q.reject(error);
        }
      });
      dependencyNames;
      if (next.length > 0) {
        return Resolves.andThen.apply(Resolves, [dependencyNames].concat(slice.call(next)));
      } else {
        return dependencyNames;
      }
    };

    return Resolves;

  })();

  (angular.module('rbs-angular-core')).constant('Resolves', Resolves);

}).call(this);

(function() {
  var ApplicationError, ErrorFactory,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  ApplicationError = (function(superClass) {
    extend(ApplicationError, superClass);

    function ApplicationError(status1, code1, message1) {
      this.status = status1;
      this.code = code1;
      this.message = message1;
    }

    return ApplicationError;

  })(Error);

  ErrorFactory = (function() {
    function ErrorFactory() {}

    ErrorFactory.create = function(status, code, message) {
      return new ApplicationError(status, code, message);
    };

    ErrorFactory["throw"] = function(status, code, message) {
      throw ErrorFactory.create(status, code, message);
    };

    return ErrorFactory;

  })();

  (angular.module('rbs-angular-core')).constant('ErrorFactory', ErrorFactory);

}).call(this);

(function() {
  var slice = [].slice;

  (angular.module('rbs-angular-core')).service('Backoff', [
    '$log', '$q', '$timeout', function($log, $q, $timeout) {
      var Backoff;
      Backoff = (function() {
        function Backoff(name, minBackoff, maxBackoff, randomFactor, task) {
          this.name = name;
          this.minBackoff = minBackoff;
          this.maxBackoff = maxBackoff;
          this.randomFactor = randomFactor;
          this.task = task;
          $log.debug("Creating " + this.name + ":", "minBackoff", this.minBackoff, "maxBackoff", this.maxBackoff, "randomFactor", this.randomFactor);
          this.$restartCount = 0;
        }

        Backoff.prototype.cancel = function() {
          var ref;
          $log.debug(this.name + " cancelled.");
          if (angular.isFunction((ref = this.$promise) != null ? ref.then : void 0)) {
            $timeout.cancel(this.$promise);
          }
          return this.$promise = void 0;
        };

        Backoff.prototype.execute = function() {
          var args;
          args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          $log.debug(this.name + " executing..");
          return this.$execute.apply(this, args).then(((function(_this) {
            return function(result) {
              return _this.$onSuccess.apply(_this, [result].concat(slice.call(args)));
            };
          })(this)), (function(_this) {
            return function(error) {
              return _this.$onFailure.apply(_this, [error].concat(slice.call(args)));
            };
          })(this));
        };

        Backoff.prototype.$onSuccess = function() {
          var args, result;
          result = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
          $log.debug(this.name + " success.");
          this.$restartCount = 0;
          return result;
        };

        Backoff.prototype.$onFailure = function() {
          var args, error, rnd;
          error = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
          rnd = 1 + Math.random() * this.randomFactor;
          this.$currentBackoff = Math.min(this.maxBackoff, this.minBackoff * Math.pow(2, this.$restartCount) * rnd);
          this.$restartCount += 1;
          $log.error(this.name + " failure! Retry in " + this.$currentBackoff + "..");
          this.$promise = $timeout(((function(_this) {
            return function() {
              return _this.execute.apply(_this, args);
            };
          })(this)), this.$currentBackoff, true);
          return this.$promise;
        };

        Backoff.prototype.$execute = function() {
          var args, error;
          args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
          return this.lastOutcome = (function() {
            var error1;
            try {
              return $q.when(this.task.apply(this, args));
            } catch (error1) {
              error = error1;
              $log.error(error);
              return $q.reject(error);
            }
          }).call(this);
        };

        return Backoff;

      })();
      return function() {
        var args;
        args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        return (function(func, args, ctor) {
          ctor.prototype = func.prototype;
          var child = new ctor, result = func.apply(child, args);
          return Object(result) === result ? result : child;
        })(Backoff, args, function(){});
      };
    }
  ]);

  (angular.module('rbs-angular-core-samples')).config([
    'ConfigurationProvider', function(ConfigurationProvider) {
      ConfigurationProvider.add('WS_URL', 'ws://example.org/events');
      ConfigurationProvider.add('WS_MIN_BACKOFF', 10 * 1000);
      return ConfigurationProvider.add('WS_MAX_BACKOFF', 120 * 1000);
    }
  ]);

  (angular.module('rbs-angular-core-samples')).run([
    '$log', '$q', '$rootScope', '$websocket', 'Backoff', 'Configuration', function($log, $q, $rootScope, $websocket, Backoff, Configuration) {
      var bo, max, min, onMessage, random;
      onMessage = function(event) {
        var message;
        message = JSON.parse(event.data);
        return $rootScope.$broadcast('ws-event', message);
      };
      min = Configuration.WS_MIN_BACKOFF;
      max = Configuration.WS_WS_MAX_BACKOFF;
      random = 0.2;
      bo = Backoff("Event stream WS", min, max, random, function() {
        var deferred, ws;
        deferred = $q.defer();
        ws = $websocket(WS_WS_URL + "/event?");
        ws.onMessage(onMessage);
        ws.onClose(function(event) {
          return deferred.reject(event);
        });
        return deferred.promise;
      });
      return bo.execute();
    }
  ]);

}).call(this);

(function() {
  (angular.module('rbs-angular-core')).service('ActionProgressSupport', [
    '$log', '$q', function($log, $q) {
      var ActionProgressSupport;
      ActionProgressSupport = (function() {
        function ActionProgressSupport() {}

        ActionProgressSupport.prototype.startProgress = function() {
          return this.progress = true;
        };

        ActionProgressSupport.prototype.stopProgress = function() {
          return this.progress = false;
        };

        return ActionProgressSupport;

      })();
      return ActionProgressSupport;
    }
  ]);

}).call(this);

(function() {
  (angular.module('rbs-angular-core')).service('ActionMessagesSupport', [
    '$log', '$q', function($log, $q) {
      var ActionMessagesSupport;
      ActionMessagesSupport = (function() {
        function ActionMessagesSupport() {}

        ActionMessagesSupport.prototype.resetMessages = function() {
          return this.messages = [];
        };

        ActionMessagesSupport.prototype.addMessage = function(type, message) {
          return (this.messages || this.resetMessages()).push({
            type: type,
            message: message
          });
        };

        ActionMessagesSupport.prototype.addError = function(error) {
          return this.addMessage('danger', error);
        };

        ActionMessagesSupport.prototype.addSuccess = function(success) {
          return this.addMessage('success', success);
        };

        ActionMessagesSupport.prototype.addInfo = function(info) {
          return this.addMessage('info', info);
        };

        ActionMessagesSupport.prototype.addWarning = function(warning) {
          return this.addMessage('warning', warning);
        };

        ActionMessagesSupport.prototype.removeMessage = function(index) {
          return this.messages.splice(index, 1);
        };

        return ActionMessagesSupport;

      })();
      return ActionMessagesSupport;
    }
  ]);

}).call(this);

(function() {
  var slice = [].slice;

  (angular.module('rbs-angular-core')).service('ActionCtrl', [
    '$log', '$q', function($log, $q) {
      var ActionCtrl;
      ActionCtrl = (function() {
        function ActionCtrl(modelName, actionName) {
          this.modelName = modelName;
          this.actionName = actionName;
        }

        ActionCtrl.prototype.performValid = function() {
          var arg, args, form;
          form = arguments[0], arg = arguments[1], args = 3 <= arguments.length ? slice.call(arguments, 2) : [];
          if (form.$valid) {
            return this.perform.apply(this, [arg].concat(slice.call(args)));
          } else {
            return this.onInvalid.apply(this, [form, arg].concat(slice.call(args)));
          }
        };

        ActionCtrl.prototype.$toPromise = function(fn) {
          var error, error1;
          try {
            return $q.when(fn());
          } catch (error1) {
            error = error1;
            return $q.reject(error);
          }
        };

        ActionCtrl.prototype.perform = function() {
          var arg, args, execute, onCompleteFailure, onCompleteSuccess, onFailure, onSuccess, postProcess, preProcess, workflow;
          arg = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
          preProcess = (function(_this) {
            return function() {
              return _this.$toPromise(function() {
                return _this.preProcess.apply(_this, [arg].concat(slice.call(args)));
              });
            };
          })(this);
          execute = (function(_this) {
            return function(arg) {
              return _this.$toPromise(function() {
                return _this.execute.apply(_this, [arg].concat(slice.call(args)));
              });
            };
          })(this);
          postProcess = (function(_this) {
            return function(result, arg) {
              return _this.$toPromise(function() {
                return _this.postProcess.apply(_this, [result, arg].concat(slice.call(args)));
              });
            };
          })(this);
          onCompleteSuccess = (function(_this) {
            return function(result, arg) {
              return _this.$toPromise(function() {
                return _this.onComplete.apply(_this, [result, arg].concat(slice.call(args)));
              }).then(function() {
                return result;
              });
            };
          })(this);
          onCompleteFailure = (function(_this) {
            return function(error, arg) {
              return _this.$toPromise(function() {
                return _this.onComplete.apply(_this, [error, arg].concat(slice.call(args)));
              }).then(function() {
                return $q.reject(error);
              });
            };
          })(this);
          onSuccess = (function(_this) {
            return function(result, arg) {
              return _this.$toPromise(function() {
                return _this.onSuccess.apply(_this, [result, arg].concat(slice.call(args)));
              });
            };
          })(this);
          onFailure = (function(_this) {
            return function(error, arg) {
              return _this.$toPromise(function() {
                return _this.onFailure.apply(_this, [error, arg].concat(slice.call(args)));
              });
            };
          })(this);
          workflow = function(arg) {
            return execute(arg).then((function(outcome) {
              return onCompleteSuccess(outcome, arg);
            }), function(error) {
              return onCompleteFailure(error, arg);
            }).then((function(result) {
              return postProcess(result, arg);
            })).then((function(result) {
              return onSuccess(result, arg);
            }))["catch"](function(error) {
              return onFailure(error, arg);
            });
          };
          return preProcess().then(workflow, function(error) {
            return onCompleteFailure(error, arg).then((function(result) {
              return onSuccess(result, arg);
            }), function(error) {
              return onFailure(error, arg);
            });
          });
        };

        ActionCtrl.prototype.preProcess = function() {
          var arg, args;
          arg = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
          $log.debug.apply($log, ['preProcess', this.actionName, this.modelName, arg].concat(slice.call(args)));
          return arg;
        };

        ActionCtrl.prototype.execute = function() {
          var arg, args;
          arg = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
          $log.debug.apply($log, ['execute', this.actionName, this.modelName, arg].concat(slice.call(args)));
          return $q.reject("Execute acttion not implemented!");
        };

        ActionCtrl.prototype.postProcess = function() {
          var arg, args;
          arg = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
          $log.debug.apply($log, ['postProcess', this.actionName, this.modelName, arg].concat(slice.call(args)));
          return arg;
        };

        ActionCtrl.prototype.onComplete = function() {
          var arg, args, outcome;
          outcome = arguments[0], arg = arguments[1], args = 3 <= arguments.length ? slice.call(arguments, 2) : [];
          return $log.debug.apply($log, ['onComplete', this.actionName, this.modelName, outcome, arg].concat(slice.call(args)));
        };

        ActionCtrl.prototype.onSuccess = function() {
          var arg, args, result;
          result = arguments[0], arg = arguments[1], args = 3 <= arguments.length ? slice.call(arguments, 2) : [];
          $log.debug.apply($log, ['onSuccess', this.actionName, this.modelName, result, arg].concat(slice.call(args)));
          return result;
        };

        ActionCtrl.prototype.onFailure = function() {
          var arg, args, error;
          error = arguments[0], arg = arguments[1], args = 3 <= arguments.length ? slice.call(arguments, 2) : [];
          $log.error.apply($log, ['onFailure', this.actionName, this.modelName, error, arg].concat(slice.call(args)));
          return $q.reject(error);
        };

        ActionCtrl.prototype.onInvalid = function() {
          var arg, args, form;
          form = arguments[0], arg = arguments[1], args = 3 <= arguments.length ? slice.call(arguments, 2) : [];
          $log.debug.apply($log, ['onInvalid', this.actionName, this.modelName, form, arg].concat(slice.call(args)));
          return $q.reject(form);
        };

        return ActionCtrl;

      })();
      return ActionCtrl;
    }
  ]);

}).call(this);

(function() {
  var ConfigurationProvider, PARAMETERS;

  PARAMETERS = {};

  ConfigurationProvider = (function() {
    function ConfigurationProvider() {}

    ConfigurationProvider.prototype.$get = function() {
      return PARAMETERS;
    };

    ConfigurationProvider.prototype.get = function(name) {
      return PARAMETERS[name];
    };

    ConfigurationProvider.prototype.add = function(name, value) {
      var entry;
      entry = {};
      entry[name] = value;
      return angular.extend(PARAMETERS, entry);
    };

    ConfigurationProvider.prototype.put = function(name, value) {
      var entry;
      entry = {};
      entry[name] = value;
      return angular.merge(PARAMETERS, entry);
    };

    ConfigurationProvider.prototype.set = function(name, value) {
      return this.add(name, value);
    };

    ConfigurationProvider.prototype.merge = function(name, value) {
      return this.put(name, value);
    };

    return ConfigurationProvider;

  })();

  (angular.module('rbs-angular-core')).provider('Configuration', ConfigurationProvider);

}).call(this);

//# sourceMappingURL=rbs-angular-core.js.map
