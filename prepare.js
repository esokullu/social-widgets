const fs = require('fs');

const  fileName =  './lib/tagsImports.js';
const styleSheetFileName = './lib/styles/stylesImports.less';

const modulesAvailable = [
		"blog",
		"comments",
        "feed",
		"feedback",
		"forum",
		"groups",
		"members",
		"messages",
		"notifications",
		"profile",
		"star",
		"private",
		"stripe"
];

const import_tags={
    blog: [
    	"blog",
		"blog-list",
		"blog-post"
	],
    comments: [
    	"comments"
	],
    feed: [
        "feed",
        "feed-activity",
        "feed-composer",
        "feed-display",
        "feed-item"
	],
	feedback : [
		"feedback"
	],
    forum: [
    	"forum",
		"forum-list",
		"forum-thread",
		"forum-composer"
	],
    groups: [
    	"group",
		"group-card",
		"group-creator",
		"group-header",
		"group-activity",
		"group-members",
		"group-settings",
		"group-list"
	],
    members: [

	],
    messages: [
    	"messages",
		"messages-composer"
	],
	notifications: [
		"notifications",
		"notifications-button",
		"notifications-list"
	],
    profile: [
		"profile",
		"profile-card",
		"profile-header",
		"profile-activity",
		"profile-followers",
		"profile-following",
		"profile-groups",
		"profile-settings",
		"profile-list"
	],
    star: [
    	"star-button",
		"star-list"
	],
    private: [
		"private-content"
	],
    stripe: [],
};

const import_scripts={
    blog: [
        "commentBlogPost",
		"editBlogPost",
		"editBlogComment",
		"getBlogComments",
		"getBlogPost",
		"getBlogPosts",
		"removeBlogPost",
		"removeBlogComment",
		"startBlogPost",
		"unpublishBlogPost",
        "showBlog",
        "showBlogComposer",
        "showBlogList",
        "showBlogPost",
    ],
    comments: [
        "addComment",
		"getComments",
		"removeComment",
        "showComments",
    ],
    feed: [
        "getStatusUpdates",
        "getStatusUpdate",
		"updateStatus",
		"removeStatusUpdate",
        "showFeedItem",
	],
	feedback:[],
    forum: [
        "getThread",
		"getThreads",
		"removeReply",
		"replyThread",
		"startThread",
        "showForum",
        "showForumComposer",
        "showForumList",
        "showForumThread",
    ],
    groups: [
        "createGroup",
        "getGroup",
        "joinGroup",
        "leaveGroup",
        "listGroups",
        "listMembers",
        "setGroupCover",
        "setGroupDescription",
		"setGroupTitle",
        "showGroup",
		"showGroupCreator",
		"deleteGroup"
    ],
    members: [
		"follow",
		"getFollowers",
		"getFollowing",
		"getMembers",
		"unfollow",
    ],
    messages: [
        "countUnreadMessages",
        "getConversation",
		"getConversations",
		"getInbox",
		"getMessage",
		"getOutbox",
		"sendAnonymousMessage",
		"sendMessage",
        "showMessages",
        "showMessagesComposer",
    ],
    notifications: [
        "getNotifications",
        "showNotificationsList",
    ],
    profile: [
        "getProfile",
        "listMemberships",
        "setAvatar",
        "setBio",
        "setBirthday",
        "setEmail",
        "setPassword",
        "setProfile",
        "setUsername",
        "showProfile",
    ],
    star: [
        "star",
        "getStar",
		"getStars",
		"getUserStars",
		"removeStar",
    ],
    private: [
        "getPrivateContent",
		"removePrivateContent",
		"editPrivateContent",
		"addPrivateContent",
    ],
    stripe: [
		"createSubscription",
		"checkSubscription",
		"tokenLogin",
    ],
};

const import_styles = {
    blog : [
        "blog",
        "blog-composer",
		"blog-list",
		"blog-post",
	],
	comments : [
		"comments"
	],
	feed : [
		"feed",
		"feed-activity",
		"feed-composer",
		"feed-display",
		"feed-item"
	],
	feedback:[
		'feedback'
	],
	forum:[
		"forum",
		"forum-list",
		"forum-thread",
		"forum-composer"
	],
	groups:[
		"group",
		"group-card",
		"group-creator",
		"group-header",
		"group-settings",
	],
	messages: [
		"messages",
		"messages-composer"
	],
	notifications: [
		"notifications",
		"notifications-button",
		"notifications-list"
	],
	private: [
		"private-content"
	],
	profile: [
		"profile",
		"profile-card",
		"profile-header",
		"profile-activity",
		"profile-settings"
	],
	star: [
		"star-list",
		"star-button"
	]
}

if(process.env.modules && process.env.modules !== "all"){
    requiredModules = modulesAvailable.filter(value => -1 !== process.env.modules.split(',').indexOf(value))
} 
else if(process.env.modules && process.env.modules == "groupsv2"){
	/*
	 * shortcut of 
	 * modules=profile,messages,notifications,feed,members,comments,blog npm run build
	 * cp dist/graph.js* ../grou-ps-v2/site/vendor/graphjs/
	 */
    requiredModules = [
		"profile", 
		"messages",
		"notifications",
		"feed", 
		"members", 
		"comments",
		"blog"
	];
} 
else {
    requiredModules = modulesAvailable;
}

let importOnly = `// These are dynamically imported .. Please check prepare.js in root folder\n`;
let importStyles = `// These are dynamically imported .. Please check prepare.js in root folder\n`;
let importModules = "";
let importScripts = "";
let graphJSObj=`\n\export default {`;

requiredModules.forEach(
    item_group => {
		console.log("Currently processing: "+item_group);
		// tags
        importModules += `\n// ${item_group}\n`;
        import_tags[item_group].forEach(
            single_tag => importModules += `import './tags/${single_tag}.tag';\n`
		);
		
		// scripts
		importScripts += `\n// ${item_group}\n`;
		graphJSObj += `\n    // ${item_group}\n    `;
		import_scripts[`${item_group}`] && import_scripts[`${item_group}`].forEach(
            single_script => {
				importScripts += `import ${single_script} from './scripts/${single_script}.js';\n`;
				graphJSObj += `${single_script}, `;
            }
		)
		
		//styles
		importStyles += `\n// ${item_group}\n`;
        import_styles[item_group] && import_styles[item_group].forEach(
            single_tag => importStyles += `@import 'components/${single_tag}.less';\n`
		);
		
    }
);
graphJSObj += "\n}"

importOnly = importModules + importScripts + graphJSObj;
writeToFile(fileName,importOnly);
writeToFile(styleSheetFileName,importStyles);

console.log(`Ready to build modules - ${requiredModules.join(", ")}\n\n`);

function checkForFile(fileName,callback) {
    fs.exists(fileName, function (exists) {
        if(exists) {
            callback();
        } else {
            fs.writeFile(fileName, {flag: 'wx'}, function (err, data) { 
                callback();
            })
        }
    });
}

function writeToFile(fileName,data) {
    checkForFile(fileName,function() {
           fs.writeFileSync(fileName, data);
    });
}