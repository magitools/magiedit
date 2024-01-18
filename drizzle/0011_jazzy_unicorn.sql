CREATE TABLE `user_publications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`user_id` text NOT NULL,
	`publisher_name` text NOT NULL,
	`publisherData` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
DROP TABLE `user_preference`;