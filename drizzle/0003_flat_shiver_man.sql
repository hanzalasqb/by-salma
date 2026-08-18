CREATE TABLE `footerSettings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`tagline` text NOT NULL,
	`copyright` varchar(160) NOT NULL,
	`exploreLinks` text NOT NULL,
	`careLinks` text NOT NULL,
	`socialText` text NOT NULL,
	`socialHandle` varchar(100) NOT NULL,
	`socialHref` varchar(255) NOT NULL,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `footerSettings_id` PRIMARY KEY(`id`)
);
