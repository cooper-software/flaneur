(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/paging/pages-control.html', '<ul class="page-control">    <li class="dot"         ng-repeat="p in pages"         ng-class="{ selected: p == page }"></li></ul>');
    }]);
})();
;(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/widgets/cooper-current-projects/cooper-current-projects.html', '<div class="paged-widget">    <h1>        <span class="gizmo">&#x1F4D3;</span>Current Projects        <flaneur-pages-control items="projects" per-page="5" page="page"></flaneur-page-control>    </h1>    <flaneur-pages items="projects" per-page="5" page="page" rotate-every="5">        <ul class="items">            <li class="item" ng-repeat="project in items | orderBy:\'name\'">                <div class="image">                    <div class="number">{{ $itemOffset + $index + 1 | zeroPadding:2 }}</div>                </div>                <div class="description">                    <h1>{{ project.name }}</h1>                    <p>                        <span class="gizmo">&#x1F464;</span>                        {{ project.team.join(", ") }}                    </p>                </div>            </li>        </ul>    </flaneur-pages></div>');
    }]);
})();
;(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/widgets/flaneur-clock/flaneur-clock.html', '<h1>{{ date | flaneurClockTime }}</h1>');
    }]);
})();
;(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/widgets/flaneur-counter/flaneur-counter.html', '<h1>{{ count }}</h1><h2>{{ label }}</h2>');
    }]);
})();
;(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/widgets/flaneur-link/flaneur-link.html', '<h1><a target="_blank" href="{{ url }}">{{ title }}</a></h1><p ng-show="description">{{ description }}</p>');
    }]);
})();
;(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/widgets/flaneur-list/flaneur-list.html', '<h1>{{ title }}</h1><ul>    <li ng-repeat="item in items">{{ item }}</li></ul>');
    }]);
})();
;(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/widgets/flaneur-tweets/flaneur-tweets.html', '<h1>{{ title }}</h1><ul>    <li ng-repeat="tweet in tweets">        <h2 class="author">{{ tweet.user.name }}</h2>        <div class="meta">            <span class="date">{{ tweet.created_at | twitterDate }}</span>            <span class="retweets" ng-if="tweet.retweet_count">                |                <ng-pluralize count="tweet.retweet_count"                              when="{\'one\': \'1 retweet\', \'other\': \'{} retweets\'}">                              </ng-pluralize>            </span>        </div>        <div class="text" ng-bind-html="tweet.text | linky:\'_blank\'"></div>    </li></ul>');
    }]);
})();
;(function() {
    var module;

    try {
        // Get current templates module
        module = angular.module('templates');
    } catch (error) {
        // Or create a new one
        module = angular.module('templates', []);
    }

    module.run(["$templateCache", function($templateCache) {
        $templateCache.put('app/widgets/flaneur-twitter-users/flaneur-twitter-users.html', '<div class="paged-widget">    <h1>        <span class="social">&#xF611;</span> Twitter        <flaneur-pages-control items="users" per-page="5" page="page"></flaneur-page-control>    </h1>    <flaneur-pages items="users" per-page="5" page="page" rotate-every="5">        <ul class="items">            <li class="item" ng-repeat="user in items">                <div ng-if="user.profile_image_url" class="image">                    <img ng-attr-src="{{ user.profile_image_url }}" />                </div>                <div class="description">                    <h1>{{ user.name }}</h1>                    <p>                        <span class="gizmo">&#x1F464;</span>{{ user.followers_count | number }}                    </p>                    <a class="handle" href="http://twitter.com/{{ user.screen_name }}" target="_blank">@{{ user.screen_name }}</a>                </div>            </li>        </ul>    </flaneur-pages></div>');
    }]);
})();
;
//# sourceMappingURL=templates.js.map