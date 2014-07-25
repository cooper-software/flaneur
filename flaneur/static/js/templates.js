!function(){var module;try{module=angular.module("templates")}catch(error){module=angular.module("templates",[])}module.run(["$templateCache",function($templateCache){$templateCache.put("app/paging/pages-control.html",'<ul class="page-control">    <li class="dot"         ng-repeat="p in pages"         ng-class="{ selected: p == page }"></li></ul>')}])}(),function(){var module;try{module=angular.module("templates")}catch(error){module=angular.module("templates",[])}module.run(["$templateCache",function($templateCache){$templateCache.put("app/widgets/cooper-current-projects/cooper-current-projects.html",'<div class="paged-widget">    <h1>        <span class="gizmo">&#x1F4D3;</span>Current Projects        <flaneur-pages-control items="projects" per-page="5" page="page"></flaneur-page-control>    </h1>    <flaneur-pages items="projects" per-page="5" page="page" rotate-every="10">        <ul class="items">            <li class="item with-image" ng-repeat="project in items | orderBy:\'name\'">                <div class="image">                    <div class="number">{{ $itemOffset + $index + 1 | zeroPadding:2 }}</div>                </div>                <div class="description">                    <h1>{{ project.name }}</h1>                    <p>                        <span class="gizmo">&#x1F464;</span>                        {{ project.team.join(", ") }}                    </p>                </div>            </li>        </ul>    </flaneur-pages></div>')}])}(),function(){var module;try{module=angular.module("templates")}catch(error){module=angular.module("templates",[])}module.run(["$templateCache",function($templateCache){$templateCache.put("app/widgets/cooper-journal-posts/cooper-journal-posts.html",'<h1>{{ title }}</h1><ul class="items items-scrollable">    <li class="item" ng-repeat="post in posts">        <h2><a href="{{ post.url }}">{{ post.title }}</a></h2>        <div class="meta">            by {{ post.authors | cooperJournalPostAuthors }}            •            {{ post.timestamp | formatTimestamp }}            •            <ng-pluralize count="post.comment_count" when="{ \'0\': \'No comments\', \'one\': \'1 Comment\', \'other\': \'{} Comments\' }"></ng-pluralize>        </div>    </li></ul>')}])}(),function(){var module;try{module=angular.module("templates")}catch(error){module=angular.module("templates",[])}module.run(["$templateCache",function($templateCache){$templateCache.put("app/widgets/flaneur-clock/flaneur-clock.html","<h1>{{ date | flaneurClockTime }}</h1>")}])}(),function(){var module;try{module=angular.module("templates")}catch(error){module=angular.module("templates",[])}module.run(["$templateCache",function($templateCache){$templateCache.put("app/widgets/flaneur-counter/flaneur-counter.html",'<div class="count">    <h1><span class="gizmo" ng-if="icon" ng-bind-html="icon"></span>{{ count | zeroPadding:2 }}</h1>    <h2>{{ label }}</h2></div>')}])}(),function(){var module;try{module=angular.module("templates")}catch(error){module=angular.module("templates",[])}module.run(["$templateCache",function($templateCache){$templateCache.put("app/widgets/flaneur-link/flaneur-link.html",'<h1><a target="_blank" href="{{ url }}">{{ title }}</a></h1><p ng-show="description">{{ description }}</p>')}])}(),function(){var module;try{module=angular.module("templates")}catch(error){module=angular.module("templates",[])}module.run(["$templateCache",function($templateCache){$templateCache.put("app/widgets/flaneur-list/flaneur-list.html",'<h1>{{ title }}</h1><ul class="items">    <li class="item " ng-repeat="item in items">{{ item }}</li></ul>')}])}(),function(){var module;try{module=angular.module("templates")}catch(error){module=angular.module("templates",[])}module.run(["$templateCache",function($templateCache){$templateCache.put("app/widgets/flaneur-tweets/flaneur-tweets.html",'<h1>    <span class="social">&#xF611;</span> {{ title }}</h1><ul class="items items-scrollable">    <li ng-repeat="tweet in tweets" class="tweet">        <div ng-if="tweet.user.profile_image_url" class="image">            <img ng-attr-src="{{ tweet.user.profile_image_url }}" />        </div>        <h2 class="author">            {{ tweet.user.name }}            <span class="meta">                <span class="date">{{ tweet.created_at | twitterDate }}</span>                <span class="retweets" ng-if="tweet.retweet_count">                    |                    <ng-pluralize count="tweet.retweet_count"                                  when="{\'one\': \'1 retweet\', \'other\': \'{} retweets\'}">                                  </ng-pluralize>                </span>            </span>        </h2>        <div class="text" ng-bind-html="tweet.text | linky:\'_blank\'"></div>    </li></ul>')}])}(),function(){var module;try{module=angular.module("templates")}catch(error){module=angular.module("templates",[])}module.run(["$templateCache",function($templateCache){$templateCache.put("app/widgets/flaneur-twitter-users/flaneur-twitter-users.html",'<div class="paged-widget">    <h1>        <span class="social">&#xF611;</span> Twitter        <flaneur-pages-control items="users" per-page="5" page="page"></flaneur-page-control>    </h1>    <flaneur-pages items="users" per-page="5" page="page" rotate-every="10">        <ul class="items">            <li class="item with-image" ng-repeat="user in items">                <div ng-if="user.profile_image_url" class="image">                    <img ng-attr-src="{{ user.profile_image_url }}" />                </div>                <div class="description">                    <h1>{{ user.name }}</h1>                    <p>                        <span class="gizmo">&#x1F464;</span>{{ user.followers_count | number }}                    </p>                    <a class="handle" href="http://twitter.com/{{ user.screen_name }}" target="_blank">@{{ user.screen_name }}</a>                </div>            </li>        </ul>    </flaneur-pages></div>')}])}(),function(){var module;try{module=angular.module("templates")}catch(error){module=angular.module("templates",[])}module.run(["$templateCache",function($templateCache){$templateCache.put("app/widgets/slack-messages/slack-messages.html",'<h1>{{ title }}</h1><ul class="items items-scrollable">    <li class="item with-image" ng-repeat="message in messages">        <div class="image">            <img ng-attr-src="{{ message.user.profile.image_48 }}" />        </div>        <div class="description">            <h1>{{ message.user.name }} <span class="time">{{ message.ts | formatTimestamp }}</span></h1>            <p ng-bind-html="message.text"></p>        </div>    </li></ul>')}])}();