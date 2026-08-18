ALTER TABLE `coupons` ADD `usageLimit` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `coupons` ADD `usageCount` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `storeSettings` ADD `storeDiscountEnabled` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `storeSettings` ADD `storeDiscountPercentage` decimal(5,2) DEFAULT '0' NOT NULL;