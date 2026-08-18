CREATE TABLE `cartItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`productId` int NOT NULL,
	`quantity` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cartItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `categories` (
	`id` int AUTO_INCREMENT NOT NULL,
	`parentId` int,
	`name` varchar(160) NOT NULL,
	`slug` varchar(180) NOT NULL,
	`description` text,
	`bannerUrl` text,
	`iconUrl` text,
	`seoTitle` varchar(255),
	`metaDescription` text,
	`isVisible` int NOT NULL DEFAULT 1,
	`sortOrder` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `categories_id` PRIMARY KEY(`id`),
	CONSTRAINT `categories_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `coupons` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(80) NOT NULL,
	`discountType` enum('percentage','fixed') NOT NULL,
	`value` decimal(10,2) NOT NULL,
	`minimumOrder` decimal(10,2) NOT NULL DEFAULT '0',
	`isActive` int NOT NULL DEFAULT 1,
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `coupons_id` PRIMARY KEY(`id`),
	CONSTRAINT `coupons_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `homepageSections` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sectionKey` varchar(80) NOT NULL,
	`label` varchar(160) NOT NULL,
	`isVisible` int NOT NULL DEFAULT 1,
	`sortOrder` int NOT NULL DEFAULT 0,
	CONSTRAINT `homepageSections_id` PRIMARY KEY(`id`),
	CONSTRAINT `homepageSections_sectionKey_unique` UNIQUE(`sectionKey`)
);
--> statement-breakpoint
CREATE TABLE `orderItems` (
	`id` int AUTO_INCREMENT NOT NULL,
	`orderId` int NOT NULL,
	`productId` int,
	`productName` varchar(255) NOT NULL,
	`unitPrice` decimal(10,2) NOT NULL,
	`quantity` int NOT NULL,
	CONSTRAINT `orderItems_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int,
	`customerName` varchar(180) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(60) NOT NULL,
	`address` text NOT NULL,
	`city` varchar(100) NOT NULL,
	`province` varchar(100) NOT NULL,
	`postalCode` varchar(30) NOT NULL,
	`orderNotes` text,
	`subtotal` decimal(10,2) NOT NULL,
	`shipping` decimal(10,2) NOT NULL,
	`discount` decimal(10,2) NOT NULL,
	`tax` decimal(10,2) NOT NULL,
	`total` decimal(10,2) NOT NULL,
	`couponCode` varchar(80),
	`status` enum('pending','processing','shipped','delivered','cancelled') NOT NULL DEFAULT 'pending',
	`paymentMethod` enum('cod','stripe') NOT NULL DEFAULT 'cod',
	`paymentStatus` enum('pending','paid','failed','refunded') NOT NULL DEFAULT 'pending',
	`stripeSessionId` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`categoryId` int NOT NULL,
	`subcategoryId` int,
	`name` varchar(255) NOT NULL,
	`slug` varchar(255) NOT NULL,
	`sku` varchar(120) NOT NULL,
	`description` text,
	`careGuide` text,
	`price` decimal(10,2) NOT NULL,
	`discountPrice` decimal(10,2),
	`stock` int NOT NULL DEFAULT 0,
	`material` varchar(120),
	`color` varchar(80),
	`size` varchar(80),
	`imageUrl` text,
	`images` text,
	`isFeatured` int NOT NULL DEFAULT 0,
	`isNew` int NOT NULL DEFAULT 0,
	`isBestSeller` int NOT NULL DEFAULT 0,
	`isVisible` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`),
	CONSTRAINT `products_slug_unique` UNIQUE(`slug`),
	CONSTRAINT `products_sku_unique` UNIQUE(`sku`)
);
--> statement-breakpoint
CREATE TABLE `shippingRules` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(160) NOT NULL,
	`freeAbove` decimal(10,2) NOT NULL,
	`flatRate` decimal(10,2) NOT NULL,
	`isActive` int NOT NULL DEFAULT 1,
	CONSTRAINT `shippingRules_id` PRIMARY KEY(`id`)
);
