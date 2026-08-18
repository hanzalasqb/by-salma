ALTER TABLE `categories` ADD `discountType` enum('percentage','fixed');--> statement-breakpoint
ALTER TABLE `categories` ADD `discountValue` decimal(10,2);--> statement-breakpoint
ALTER TABLE `products` ADD `discountType` enum('percentage','fixed');--> statement-breakpoint
ALTER TABLE `products` ADD `discountValue` decimal(10,2);--> statement-breakpoint
ALTER TABLE `products` ADD `saleStartsAt` timestamp;--> statement-breakpoint
ALTER TABLE `products` ADD `saleEndsAt` timestamp;