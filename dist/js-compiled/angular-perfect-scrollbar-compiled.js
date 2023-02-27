"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _perfectScrollbar = _interopRequireDefault(require("perfect-scrollbar"));
var _angular = _interopRequireDefault(require("angular"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var _default = _angular["default"].module('perfect_scrollbar', []).directive('perfectScrollbar', ['$parse', '$window', function ($parse, $window) {
  var psOptions = ['wheelSpeed', 'wheelPropagation', 'minScrollbarLength', 'useBothWheelAxes', 'useKeyboard', 'suppressScrollX', 'suppressScrollY', 'scrollXMarginOffset', 'scrollYMarginOffset', 'includePadding' //, 'onScroll', 'scrollDown'
  ];

  return {
    restrict: 'EA',
    transclude: true,
    template: '<div><div class="scroll-transclude-content" ng-transclude></div></div>',
    replace: true,
    link: function link($scope, $elem, $attr) {
      var jqWindow = _angular["default"].element($window);
      var options = {};
      for (var i = 0, l = psOptions.length; i < l; i++) {
        var opt = psOptions[i];
        if ($attr[opt] !== undefined) {
          options[opt] = $parse($attr[opt])();
        }
      }
      $scope.$evalAsync(function () {
        _perfectScrollbar["default"].initialize($elem[0], options);
        // $elem.perfectScrollbar(options);
        // var onScrollHandler = $parse($attr.onScroll)
        // $elem.scroll(function(){
        //   var scrollTop = $elem.scrollTop()
        //   var scrollHeight = $elem.prop('scrollHeight') - $elem.height()
        //   $scope.$apply(function() {
        //     onScrollHandler($scope, {
        //       scrollTop: scrollTop,
        //       scrollHeight: scrollHeight
        //     })
        //   })
        // });
      });

      // Automatically update when content height changes
      $scope.$watch(function () {
        var selector = $elem.find('.scroll-transclude-content');
        return selector.height() + '-' + selector.width();
      }, function (newValue, oldValue) {
        if (newValue) {
          update('contentSizeChange');
        }
      });

      // Automatically update when container height changes
      $scope.$watch(function () {
        return $elem.height() + '-' + $elem.width();
      }, function (newValue, oldValue) {
        if (newValue) {
          update('contentSizeChange');
        }
      });
      function update(event) {
        $scope.$evalAsync(function () {
          if ($attr.scrollDown == 'true' && event != 'mouseenter') {
            setTimeout(function () {
              _perfectScrollbar["default"].update($elem[0]);
              return;
              // $($elem).scrollTop($($elem).prop("scrollHeight"));
            }, 100);
          }
          _perfectScrollbar["default"].update($elem[0]);
          // $elem.perfectScrollbar('update');
        });
      }

      // This is necessary when you don't watch anything with the scrollbar
      $elem.bind('mouseenter', update('mouseenter'));

      // Possible future improvement - check the type here and use the appropriate watch for non-arrays
      if ($attr.refreshOnChange) {
        $scope.$watchCollection($attr.refreshOnChange, function () {
          update();
        });
      }

      // this is from a pull request - I am not totally sure what the original issue is but seems harmless
      if ($attr.refreshOnResize) {
        jqWindow.on('resize', update);
      }

      // use to force rendering refresh
      $scope.$on('refreshScrollbars', function () {
        update();
      });
      $scope.$on('$destroy', function () {
        jqWindow.off('resize', update);
        _perfectScrollbar["default"].destroy($elem[0]);
      });
    }
  };
}]).name;
exports["default"] = _default;
//# sourceMappingURL=angular-perfect-scrollbar-compiled.js.map
