import ps from 'perfect-scrollbar';
import angular from 'angular';

export default angular.module('perfect_scrollbar', [])
    .directive('perfectScrollbar',
        ['$parse', '$window', function ($parse, $window) {
            var psOptions = [
                'wheelSpeed', 'wheelPropagation', 'minScrollbarLength', 'useBothWheelAxes',
                'useKeyboard', 'suppressScrollX', 'suppressScrollY', 'scrollXMarginOffset',
                'scrollYMarginOffset', 'includePadding'//, 'onScroll', 'scrollDown'
            ];

            return {
                restrict: 'EA',
                transclude: true,
                template: '<div><div class="scroll-transclude-content" ng-transclude></div></div>',
                replace: true,
                link: function ($scope, $elem, $attr) {
                    var jqWindow = angular.element($window);
                    var options = {};

                    for (var i = 0, l = psOptions.length; i < l; i++) {
                        var opt = psOptions[i];
                        if ($attr[opt] !== undefined) {
                            options[opt] = $parse($attr[opt])();
                        }
                    }

                    $scope.$evalAsync(function () {
                        ps.initialize($elem[0], options);
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
                        const selector = $elem.find('.scroll-transclude-content');
                        return selector.height() + '-' + selector.width() ;
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

                                    ps.update($elem[0]);
                                    return;
                                    // $($elem).scrollTop($($elem).prop("scrollHeight"));
                                }, 100);
                            }
                            ps.update($elem[0]);
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
                        ps.destroy($elem[0]);
                    });
                }
            };
        }]
    )
    .name;
