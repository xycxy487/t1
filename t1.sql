/*
 Navicat Premium Dump SQL

 Source Server         : 本机
 Source Server Type    : MySQL
 Source Server Version : 80039 (8.0.39)
 Source Host           : localhost:3306
 Source Schema         : t1

 Target Server Type    : MySQL
 Target Server Version : 80039 (8.0.39)
 File Encoding         : 65001

 Date: 04/12/2025 10:36:20
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for comments
-- ----------------------------
DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `feed_id` int NOT NULL COMMENT '动态ID',
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '评论者用户名',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '评论者头像',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '评论内容',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP COMMENT '评论时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `idx_feed_id`(`feed_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 202 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of comments
-- ----------------------------
INSERT INTO `comments` VALUES (101, 1, '故宫爱好者', '/images/hangz.jpg', '珍宝馆的翡翠白菜真的惊艳！我去年去看过', '2025-11-20 13:10:55');
INSERT INTO `comments` VALUES (102, 1, '历史迷', '/images/shanghai.jpg', '建议早上去，人少的时候更有感觉', '2025-12-01 09:10:40');
INSERT INTO `comments` VALUES (201, 2, '吃货小分队', '/images/banner/ba2.jpg', '他们家的蟹粉小笼也是一绝！', '2025-11-30 12:30:00');

-- ----------------------------
-- Table structure for feeds
-- ----------------------------
DROP TABLE IF EXISTS `feeds`;
CREATE TABLE `feeds`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL COMMENT '用户名',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '头像路径',
  `publish_time` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT NULL COMMENT '发布时间描述，如：3小时前',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL COMMENT '动态内容',
  `images` json NULL COMMENT '图片数组，存储JSON格式',
  `likes` int NULL DEFAULT 0 COMMENT '点赞数',
  `comments_count` int NULL DEFAULT 0 COMMENT '评论数',
  `liked` tinyint(1) NULL DEFAULT 0 COMMENT '当前用户是否点赞',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of feeds
-- ----------------------------
INSERT INTO `feeds` VALUES (1, '旅行达人', '/images/chengdu.jpg', '2025.11.18', '刚刚从北京回来，故宫真是太壮观了！推荐大家一定要去看看，特别是珍宝馆，里面的文物精美绝伦。', '[\"/images/Beijing.jpg\"]', 24, 2, 0);
INSERT INTO `feeds` VALUES (2, '美食探索者', '/images/shanghai.jpg', '2025.12.01', '上海的小笼包真的名不虚传，汤汁鲜美，皮薄馅多。推荐城隍庙附近的南翔馒头店，虽然要排队，但绝对值得！', '[\"/images/food.jpg\"]', 15, 1, 0);

-- ----------------------------
-- Table structure for user_login_logs
-- ----------------------------
DROP TABLE IF EXISTS `user_login_logs`;
CREATE TABLE `user_login_logs`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `openid` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `login_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `nickname` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '',
  `avatar_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `openid`(`openid` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 22 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_login_logs
-- ----------------------------
INSERT INTO `user_login_logs` VALUES (1, 'oApIC7HcGeFTFEg_HkkKBZlL8Xe4', '2025-11-25 11:10:39', 'hhhhh', 'http://tmp/Y7Nw2BhiQ3tA38ece1efbd7cf2e67468cff95f203631.jpeg');
INSERT INTO `user_login_logs` VALUES (2, 'oApIC7HcGeFTFEg_HkkKBZlL8Xe4', '2025-11-25 11:39:38', 'hhhhhhhhh', 'http://tmp/LZy0Mj0Gb4ko17fce39c4654aa57f22b8b692e2f39d8.jpeg');
INSERT INTO `user_login_logs` VALUES (3, 'oApIC7HcGeFTFEg_HkkKBZlL8Xe4', '2025-11-25 11:51:27', '不知道', 'http://tmp/4jracS7rBKsI20fad88e3520d2504b2377350e4e8df0.jpeg');
INSERT INTO `user_login_logs` VALUES (4, 'oApIC7HcGeFTFEg_HkkKBZlL8Xe4', '2025-11-25 11:58:17', '你好', 'http://tmp/elprsMzHbkUpc22fe8222191c3a88267acbae68a08cf.jpeg');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `openid` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `nickname` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '微信用户',
  `avatar_url` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NULL DEFAULT '',
  `create_time` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `openid`(`openid` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'oApIC7HcGeFTFEg_HkkKBZlL8Xe4', '河曲北山', 'http://tmp/DT3VPwcvgUUe3abb6cf82e7636711b3ad93ab66152c5.jpeg', '2025-11-25 10:36:38');

SET FOREIGN_KEY_CHECKS = 1;
