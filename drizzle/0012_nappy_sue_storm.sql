DROP TABLE `user_key`;--> statement-breakpoint
ALTER TABLE user ADD `github_id` integer;--> statement-breakpoint
ALTER TABLE user_session ADD `expires_at` integer NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `user_github_id_unique` ON `user` (`github_id`);--> statement-breakpoint
ALTER TABLE `user_session` DROP COLUMN `active_expires`;--> statement-breakpoint
ALTER TABLE `user_session` DROP COLUMN `idle_expires`;