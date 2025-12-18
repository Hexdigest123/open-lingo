import {
	pgTable,
	pgEnum,
	serial,
	varchar,
	text,
	integer,
	boolean,
	timestamp,
	jsonb,
	unique,
	index
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const levelCodeEnum = pgEnum('level_code', ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']);

export const questionTypeEnum = pgEnum('question_type', [
	'fill_blank',
	'multiple_choice',
	'translation',
	'matching',
	'speaking',
	'listening',
	'word_order'
]);

export type QuestionType = (typeof questionTypeEnum.enumValues)[number];

export const progressStatusEnum = pgEnum('progress_status', [
	'not_started',
	'in_progress',
	'completed',
	'mastered',
	'skipped'
]);

export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);

export const signupModeEnum = pgEnum('signup_mode', ['open', 'invitation', 'approval']);

export const approvalStatusEnum = pgEnum('approval_status', ['pending', 'approved', 'rejected']);

export const leaderboardTimeframeEnum = pgEnum('leaderboard_timeframe', [
	'daily',
	'weekly',
	'monthly',
	'all_time'
]);

// Users table
export const users = pgTable(
	'users',
	{
		id: serial('id').primaryKey(),
		email: varchar('email', { length: 255 }).notNull().unique(),
		passwordHash: varchar('password_hash', { length: 255 }).notNull(),
		displayName: varchar('display_name', { length: 100 }).notNull(),
		avatarUrl: varchar('avatar_url', { length: 500 }),
		role: userRoleEnum('role').default('user').notNull(),
		openaiApiKeyEncrypted: text('openai_api_key_encrypted'),
		heartsDisabled: boolean('hearts_disabled').default(false).notNull(),
		approvalStatus: approvalStatusEnum('approval_status').default('approved').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(table) => [index('users_email_idx').on(table.email)]
);

// Refresh tokens table
export const refreshTokens = pgTable(
	'refresh_tokens',
	{
		id: serial('id').primaryKey(),
		userId: integer('user_id')
			.references(() => users.id, { onDelete: 'cascade' })
			.notNull(),
		tokenHash: varchar('token_hash', { length: 255 }).notNull(),
		expiresAt: timestamp('expires_at').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull()
	},
	(table) => [
		index('refresh_tokens_user_id_idx').on(table.userId),
		index('refresh_tokens_expires_at_idx').on(table.expiresAt)
	]
);

// Levels table (A1-C2)
export const levels = pgTable('levels', {
	id: serial('id').primaryKey(),
	code: levelCodeEnum('code').notNull().unique(),
	name: varchar('name', { length: 100 }).notNull(),
	description: text('description'),
	order: integer('order').notNull()
});

// Units table
export const units = pgTable(
	'units',
	{
		id: serial('id').primaryKey(),
		levelId: integer('level_id')
			.references(() => levels.id, { onDelete: 'cascade' })
			.notNull(),
		title: varchar('title', { length: 200 }).notNull(),
		description: text('description'),
		order: integer('order').notNull(),
		themeColor: varchar('theme_color', { length: 7 }) // hex color
	},
	(table) => [index('units_level_id_idx').on(table.levelId)]
);

// Lessons table
export const lessons = pgTable(
	'lessons',
	{
		id: serial('id').primaryKey(),
		unitId: integer('unit_id')
			.references(() => units.id, { onDelete: 'cascade' })
			.notNull(),
		title: varchar('title', { length: 200 }).notNull(), // JSON: {"en":"...","de":"..."}
		description: text('description'), // JSON: {"en":"...","de":"..."}
		xpReward: integer('xp_reward').default(10).notNull(),
		order: integer('order').notNull(),
		isPublished: boolean('is_published').default(false).notNull(),
		// Exam functionality
		isExam: boolean('is_exam').default(false).notNull(),
		examPassThreshold: integer('exam_pass_threshold').default(80), // 80% to pass
		requiredLessonId: integer('required_lesson_id'), // Prerequisite lesson
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(table) => [index('lessons_unit_id_idx').on(table.unitId)]
);

// Questions table
export const questions = pgTable(
	'questions',
	{
		id: serial('id').primaryKey(),
		lessonId: integer('lesson_id')
			.references(() => lessons.id, { onDelete: 'cascade' })
			.notNull(),
		type: questionTypeEnum('type').notNull(),
		content: jsonb('content').notNull(), // Flexible JSON for different question types
		correctAnswer: text('correct_answer').notNull(),
		audioUrl: varchar('audio_url', { length: 500 }),
		order: integer('order').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull()
	},
	(table) => [index('questions_lesson_id_idx').on(table.lessonId)]
);

// User stats table (gamification)
export const userStats = pgTable(
	'user_stats',
	{
		id: serial('id').primaryKey(),
		userId: integer('user_id')
			.references(() => users.id, { onDelete: 'cascade' })
			.notNull()
			.unique(),
		hearts: integer('hearts').default(10).notNull(),
		heartsLastRefilled: timestamp('hearts_last_refilled').defaultNow().notNull(),
		xpTotal: integer('xp_total').default(0).notNull(),
		currentStreak: integer('current_streak').default(0).notNull(),
		longestStreak: integer('longest_streak').default(0).notNull(),
		lastActivity: timestamp('last_activity'),
		// Streak freeze system
		streakFreezes: integer('streak_freezes').default(0).notNull(),
		freezesEarnedTotal: integer('freezes_earned_total').default(0).notNull(),
		totalCorrectAnswers: integer('total_correct_answers').default(0).notNull(),
		lessonsCompleted: integer('lessons_completed').default(0).notNull()
	},
	(table) => [index('user_stats_user_id_idx').on(table.userId)]
);

// User lesson progress table
export const userLessonProgress = pgTable(
	'user_lesson_progress',
	{
		id: serial('id').primaryKey(),
		userId: integer('user_id')
			.references(() => users.id, { onDelete: 'cascade' })
			.notNull(),
		lessonId: integer('lesson_id')
			.references(() => lessons.id, { onDelete: 'cascade' })
			.notNull(),
		status: progressStatusEnum('status').default('not_started').notNull(),
		score: integer('score'), // Percentage 0-100
		attempts: integer('attempts').default(0).notNull(),
		completedAt: timestamp('completed_at'),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(table) => [
		unique('user_lesson_progress_unique').on(table.userId, table.lessonId),
		index('user_lesson_progress_user_id_idx').on(table.userId),
		index('user_lesson_progress_lesson_id_idx').on(table.lessonId)
	]
);

// User question attempts table
export const userQuestionAttempts = pgTable(
	'user_question_attempts',
	{
		id: serial('id').primaryKey(),
		userId: integer('user_id')
			.references(() => users.id, { onDelete: 'cascade' })
			.notNull(),
		questionId: integer('question_id')
			.references(() => questions.id, { onDelete: 'cascade' })
			.notNull(),
		answer: text('answer').notNull(),
		isCorrect: boolean('is_correct').notNull(),
		aiFeedback: text('ai_feedback'),
		createdAt: timestamp('created_at').defaultNow().notNull()
	},
	(table) => [
		index('user_question_attempts_user_id_idx').on(table.userId),
		index('user_question_attempts_question_id_idx').on(table.questionId)
	]
);

// Daily streaks table
export const dailyStreaks = pgTable(
	'daily_streaks',
	{
		id: serial('id').primaryKey(),
		userId: integer('user_id')
			.references(() => users.id, { onDelete: 'cascade' })
			.notNull(),
		activityDate: timestamp('activity_date').notNull(),
		xpEarned: integer('xp_earned').default(0).notNull()
	},
	(table) => [
		unique('daily_streaks_unique').on(table.userId, table.activityDate),
		index('daily_streaks_user_id_idx').on(table.userId)
	]
);

// Achievements table
export const achievements = pgTable('achievements', {
	id: serial('id').primaryKey(),
	code: varchar('code', { length: 50 }).notNull().unique(),
	name: varchar('name', { length: 100 }).notNull(),
	description: text('description').notNull(),
	iconUrl: varchar('icon_url', { length: 500 }),
	criteria: jsonb('criteria').notNull(), // JSON defining how to earn
	createdAt: timestamp('created_at').defaultNow().notNull()
});

// User achievements table
export const userAchievements = pgTable(
	'user_achievements',
	{
		id: serial('id').primaryKey(),
		userId: integer('user_id')
			.references(() => users.id, { onDelete: 'cascade' })
			.notNull(),
		achievementId: integer('achievement_id')
			.references(() => achievements.id, { onDelete: 'cascade' })
			.notNull(),
		earnedAt: timestamp('earned_at').defaultNow().notNull()
	},
	(table) => [
		unique('user_achievements_unique').on(table.userId, table.achievementId),
		index('user_achievements_user_id_idx').on(table.userId)
	]
);

// Leaderboard cache table
export const leaderboardCache = pgTable(
	'leaderboard_cache',
	{
		id: serial('id').primaryKey(),
		userId: integer('user_id')
			.references(() => users.id, { onDelete: 'cascade' })
			.notNull(),
		timeframe: leaderboardTimeframeEnum('timeframe').notNull(),
		rank: integer('rank').notNull(),
		xp: integer('xp').notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(table) => [
		unique('leaderboard_cache_unique').on(table.userId, table.timeframe),
		index('leaderboard_cache_timeframe_rank_idx').on(table.timeframe, table.rank)
	]
);

// Chat enums
export const chatModeEnum = pgEnum('chat_mode', ['voice', 'text']);
export const chatRoleEnum = pgEnum('chat_role', ['user', 'assistant', 'system']);

// Chat sessions table
export const chatSessions = pgTable(
	'chat_sessions',
	{
		id: serial('id').primaryKey(),
		userId: integer('user_id')
			.references(() => users.id, { onDelete: 'cascade' })
			.notNull(),
		title: varchar('title', { length: 200 }),
		mode: chatModeEnum('mode').default('text').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(table) => [index('chat_sessions_user_id_idx').on(table.userId)]
);

// Chat messages table
export const chatMessages = pgTable(
	'chat_messages',
	{
		id: serial('id').primaryKey(),
		sessionId: integer('session_id')
			.references(() => chatSessions.id, { onDelete: 'cascade' })
			.notNull(),
		role: chatRoleEnum('role').notNull(),
		content: text('content').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull()
	},
	(table) => [index('chat_messages_session_id_idx').on(table.sessionId)]
);

// API usage type enum
export const apiUsageTypeEnum = pgEnum('api_usage_type', ['chat', 'voice', 'explain']);

// API usage logs table (for global key usage auditing)
export const apiUsageLogs = pgTable(
	'api_usage_logs',
	{
		id: serial('id').primaryKey(),
		userId: integer('user_id')
			.references(() => users.id, { onDelete: 'cascade' })
			.notNull(),
		usageType: apiUsageTypeEnum('usage_type').notNull(),
		sessionId: integer('session_id').references(() => chatSessions.id, { onDelete: 'set null' }),
		promptTokens: integer('prompt_tokens').default(0).notNull(),
		completionTokens: integer('completion_tokens').default(0).notNull(),
		totalTokens: integer('total_tokens').default(0).notNull(),
		model: varchar('model', { length: 100 }),
		createdAt: timestamp('created_at').defaultNow().notNull()
	},
	(table) => [
		index('api_usage_logs_user_id_idx').on(table.userId),
		index('api_usage_logs_created_at_idx').on(table.createdAt)
	]
);

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
	stats: one(userStats, {
		fields: [users.id],
		references: [userStats.userId]
	}),
	refreshTokens: many(refreshTokens),
	lessonProgress: many(userLessonProgress),
	questionAttempts: many(userQuestionAttempts),
	apiUsageLogs: many(apiUsageLogs),
	dailyStreaks: many(dailyStreaks),
	achievements: many(userAchievements),
	leaderboardEntries: many(leaderboardCache),
	chatSessions: many(chatSessions)
}));

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
	user: one(users, {
		fields: [refreshTokens.userId],
		references: [users.id]
	})
}));

export const levelsRelations = relations(levels, ({ many }) => ({
	units: many(units)
}));

export const unitsRelations = relations(units, ({ one, many }) => ({
	level: one(levels, {
		fields: [units.levelId],
		references: [levels.id]
	}),
	lessons: many(lessons)
}));

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
	unit: one(units, {
		fields: [lessons.unitId],
		references: [units.id]
	}),
	questions: many(questions),
	userProgress: many(userLessonProgress)
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
	lesson: one(lessons, {
		fields: [questions.lessonId],
		references: [lessons.id]
	}),
	attempts: many(userQuestionAttempts)
}));

export const userStatsRelations = relations(userStats, ({ one }) => ({
	user: one(users, {
		fields: [userStats.userId],
		references: [users.id]
	})
}));

export const userLessonProgressRelations = relations(userLessonProgress, ({ one }) => ({
	user: one(users, {
		fields: [userLessonProgress.userId],
		references: [users.id]
	}),
	lesson: one(lessons, {
		fields: [userLessonProgress.lessonId],
		references: [lessons.id]
	})
}));

export const userQuestionAttemptsRelations = relations(userQuestionAttempts, ({ one }) => ({
	user: one(users, {
		fields: [userQuestionAttempts.userId],
		references: [users.id]
	}),
	question: one(questions, {
		fields: [userQuestionAttempts.questionId],
		references: [questions.id]
	})
}));

export const dailyStreaksRelations = relations(dailyStreaks, ({ one }) => ({
	user: one(users, {
		fields: [dailyStreaks.userId],
		references: [users.id]
	})
}));

export const achievementsRelations = relations(achievements, ({ many }) => ({
	userAchievements: many(userAchievements)
}));

export const userAchievementsRelations = relations(userAchievements, ({ one }) => ({
	user: one(users, {
		fields: [userAchievements.userId],
		references: [users.id]
	}),
	achievement: one(achievements, {
		fields: [userAchievements.achievementId],
		references: [achievements.id]
	})
}));

export const leaderboardCacheRelations = relations(leaderboardCache, ({ one }) => ({
	user: one(users, {
		fields: [leaderboardCache.userId],
		references: [users.id]
	})
}));

export const chatSessionsRelations = relations(chatSessions, ({ one, many }) => ({
	user: one(users, {
		fields: [chatSessions.userId],
		references: [users.id]
	}),
	messages: many(chatMessages)
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
	session: one(chatSessions, {
		fields: [chatMessages.sessionId],
		references: [chatSessions.id]
	})
}));

export const apiUsageLogsRelations = relations(apiUsageLogs, ({ one }) => ({
	user: one(users, {
		fields: [apiUsageLogs.userId],
		references: [users.id]
	}),
	session: one(chatSessions, {
		fields: [apiUsageLogs.sessionId],
		references: [chatSessions.id]
	})
}));

// App settings table (for global configuration)
export const appSettings = pgTable('app_settings', {
	id: serial('id').primaryKey(),
	key: varchar('key', { length: 100 }).notNull().unique(),
	value: text('value'),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Invitations table (for invitation-only signups)
export const invitations = pgTable(
	'invitations',
	{
		id: serial('id').primaryKey(),
		email: varchar('email', { length: 255 }), // Optional - null for generic invites
		code: varchar('code', { length: 64 }).notNull().unique(),
		usedAt: timestamp('used_at'),
		usedByUserId: integer('used_by_user_id').references(() => users.id, { onDelete: 'set null' }),
		createdById: integer('created_by_id')
			.references(() => users.id, { onDelete: 'set null' })
			.notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		expiresAt: timestamp('expires_at').notNull()
	},
	(table) => [
		index('invitations_code_idx').on(table.code),
		index('invitations_email_idx').on(table.email)
	]
);

// Invitations relations
export const invitationsRelations = relations(invitations, ({ one }) => ({
	usedBy: one(users, {
		fields: [invitations.usedByUserId],
		references: [users.id],
		relationName: 'usedByUser'
	}),
	createdBy: one(users, {
		fields: [invitations.createdById],
		references: [users.id],
		relationName: 'createdByUser'
	})
}));

// Type exports for use throughout the app
export type AppSetting = typeof appSettings.$inferSelect;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Level = typeof levels.$inferSelect;
export type Unit = typeof units.$inferSelect;
export type Lesson = typeof lessons.$inferSelect;
export type Question = typeof questions.$inferSelect;
export type UserStats = typeof userStats.$inferSelect;
export type UserLessonProgress = typeof userLessonProgress.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type ChatSession = typeof chatSessions.$inferSelect;
export type NewChatSession = typeof chatSessions.$inferInsert;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type NewChatMessage = typeof chatMessages.$inferInsert;
export type Invitation = typeof invitations.$inferSelect;
export type NewInvitation = typeof invitations.$inferInsert;
