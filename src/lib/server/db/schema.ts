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
	index,
	uuid,
	real
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Enums
export const levelCodeEnum = pgEnum('level_code', ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']);

// Supported target languages table
export const languages = pgTable('languages', {
	code: varchar('code', { length: 10 }).primaryKey(),
	name: varchar('name', { length: 100 }).notNull(),
	nativeName: varchar('native_name', { length: 100 }).notNull(),
	flagEmoji: varchar('flag_emoji', { length: 10 }).notNull(),
	whisperCode: varchar('whisper_code', { length: 10 }).notNull(),
	tutorName: varchar('tutor_name', { length: 100 }).notNull(),
	tutorGreeting: text('tutor_greeting'),
	isActive: boolean('is_active').default(true).notNull(),
	order: integer('order').notNull()
});

export const questionTypeEnum = pgEnum('question_type', [
	'fill_blank',
	'multiple_choice',
	'translation',
	'matching',
	'speaking',
	'listening',
	'word_order',
	'character_recognition',
	'character_writing',
	'script_transliteration',
	'conjugation_cloze',
	'particle_selection',
	'grammar_transformation',
	'kanji_composition',
	'minimal_pair_discrimination',
	'dictation',
	'guided_composition'
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

export const friendshipStatusEnum = pgEnum('friendship_status', [
	'pending',
	'accepted',
	'rejected'
]);

export const challengeTypeEnum = pgEnum('challenge_type', [
	'xp_goal',
	'correct_answers',
	'lessons_completed',
	'perfect_lessons',
	'review_sessions'
]);

// Learning system enums
export const conceptTypeEnum = pgEnum('concept_type', [
	'vocab',
	'grammar_rule',
	'writing_char',
	'kanji',
	'radical',
	'phonetic_sound',
	'conjugation_pattern',
	'particle_usage',
	'sentence_pattern',
	'listening_contrast',
	'composition_frame'
]);

export const skillTypeEnum = pgEnum('skill_type', [
	'writing',
	'grammar',
	'vocabulary',
	'pronunciation',
	'composition',
	'review',
	'kana',
	'kanji',
	'radical',
	'listening',
	'speaking',
	'conjugation'
]);

export const skillStatusEnum = pgEnum('skill_status', [
	'locked',
	'unlocked',
	'in_progress',
	'mastered'
]);

export const lessonModeEnum = pgEnum('lesson_mode', ['legacy_quiz', 'guided_skill']);

export const lessonBlockTypeEnum = pgEnum('lesson_block_type', [
	'teach',
	'drill',
	'checkpoint',
	'review',
	'exam'
]);

export const conceptProgressStatusEnum = pgEnum('concept_progress_status', [
	'new',
	'learning',
	'reviewing',
	'mastered'
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
		activeLanguage: varchar('active_language', { length: 10 })
			.references(() => languages.code)
			.default('es'),
		locale: varchar('locale', { length: 10 }),
		onboardingCompleted: boolean('onboarding_completed').default(false).notNull(),
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
export const levels = pgTable(
	'levels',
	{
		id: serial('id').primaryKey(),
		code: levelCodeEnum('code').notNull(),
		languageCode: varchar('language_code', { length: 10 })
			.references(() => languages.code, { onDelete: 'cascade' })
			.notNull()
			.default('es'),
		name: varchar('name', { length: 100 }).notNull(),
		description: text('description'),
		order: integer('order').notNull()
	},
	(table) => [unique('levels_code_language_unique').on(table.code, table.languageCode)]
);

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
		mode: lessonModeEnum('mode').default('legacy_quiz').notNull(),
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
		lessonsCompleted: integer('lessons_completed').default(0).notNull(),
		dailyXpGoal: integer('daily_xp_goal').default(20).notNull(),
		soundEnabled: boolean('sound_enabled').default(true).notNull(),
		gems: integer('gems').default(0).notNull(),
		level: integer('level').default(1).notNull(),
		perfectLessons: integer('perfect_lessons').default(0).notNull()
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

// ─── Gamification Tables ────────────────────────────────────────────────────

export const weeklyChallenges = pgTable(
	'weekly_challenges',
	{
		id: serial('id').primaryKey(),
		type: challengeTypeEnum('type').notNull(),
		targetValue: integer('target_value').notNull(),
		xpReward: integer('xp_reward').notNull(),
		titleEn: varchar('title_en', { length: 200 }).notNull(),
		titleDe: varchar('title_de', { length: 200 }).notNull(),
		descriptionEn: text('description_en'),
		descriptionDe: text('description_de'),
		weekStart: timestamp('week_start').notNull(),
		weekEnd: timestamp('week_end').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull()
	},
	(table) => [index('weekly_challenges_week_idx').on(table.weekStart, table.weekEnd)]
);

export const userChallenges = pgTable(
	'user_challenges',
	{
		id: serial('id').primaryKey(),
		userId: integer('user_id')
			.references(() => users.id, { onDelete: 'cascade' })
			.notNull(),
		challengeId: integer('challenge_id')
			.references(() => weeklyChallenges.id, { onDelete: 'cascade' })
			.notNull(),
		progress: integer('progress').default(0).notNull(),
		completedAt: timestamp('completed_at'),
		xpAwarded: boolean('xp_awarded').default(false).notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull()
	},
	(table) => [
		unique('user_challenges_unique').on(table.userId, table.challengeId),
		index('user_challenges_user_id_idx').on(table.userId),
		index('user_challenges_challenge_id_idx').on(table.challengeId)
	]
);

export const friendships = pgTable(
	'friendships',
	{
		id: serial('id').primaryKey(),
		requesterId: integer('requester_id')
			.references(() => users.id, { onDelete: 'cascade' })
			.notNull(),
		addresseeId: integer('addressee_id')
			.references(() => users.id, { onDelete: 'cascade' })
			.notNull(),
		status: friendshipStatusEnum('status').default('pending').notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(table) => [
		unique('friendships_pair_unique').on(table.requesterId, table.addresseeId),
		index('friendships_requester_id_idx').on(table.requesterId),
		index('friendships_addressee_id_idx').on(table.addresseeId)
	]
);

export const shopItems = pgTable('shop_items', {
	id: serial('id').primaryKey(),
	key: varchar('key', { length: 50 }).notNull().unique(),
	titleEn: varchar('title_en', { length: 200 }).notNull(),
	titleDe: varchar('title_de', { length: 200 }).notNull(),
	descriptionEn: text('description_en'),
	descriptionDe: text('description_de'),
	costGems: integer('cost_gems').notNull(),
	effectType: varchar('effect_type', { length: 50 }).notNull(),
	effectValue: integer('effect_value').default(1).notNull(),
	iconUrl: varchar('icon_url', { length: 500 }),
	isActive: boolean('is_active').default(true).notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull()
});

export const userPurchases = pgTable(
	'user_purchases',
	{
		id: serial('id').primaryKey(),
		userId: integer('user_id')
			.references(() => users.id, { onDelete: 'cascade' })
			.notNull(),
		itemId: integer('item_id')
			.references(() => shopItems.id, { onDelete: 'cascade' })
			.notNull(),
		purchasedAt: timestamp('purchased_at').defaultNow().notNull()
	},
	(table) => [
		index('user_purchases_user_id_idx').on(table.userId),
		index('user_purchases_item_id_idx').on(table.itemId)
	]
);

// Chat enums
export const chatModeEnum = pgEnum('chat_mode', ['voice', 'text']);
export const chatRoleEnum = pgEnum('chat_role', ['user', 'assistant', 'system']);

// Chat sessions table
export const chatSessions = pgTable(
	'chat_sessions',
	{
		id: uuid('id').defaultRandom().primaryKey(),
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
		sessionId: uuid('session_id')
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
		sessionId: uuid('session_id').references(() => chatSessions.id, { onDelete: 'set null' }),
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
	chatSessions: many(chatSessions),
	conceptProgress: many(userConceptProgress),
	skillProgress: many(userSkillProgress),
	placementSessions: many(placementSessions),
	challenges: many(userChallenges),
	purchases: many(userPurchases),
	sentFriendRequests: many(friendships, { relationName: 'requester' }),
	receivedFriendRequests: many(friendships, { relationName: 'addressee' })
}));

export const refreshTokensRelations = relations(refreshTokens, ({ one }) => ({
	user: one(users, {
		fields: [refreshTokens.userId],
		references: [users.id]
	})
}));

export const languagesRelations = relations(languages, ({ many }) => ({
	levels: many(levels),
	concepts: many(concepts),
	skills: many(skills)
}));

export const levelsRelations = relations(levels, ({ one, many }) => ({
	language: one(languages, {
		fields: [levels.languageCode],
		references: [languages.code]
	}),
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
	userProgress: many(userLessonProgress),
	lessonSkills: many(lessonSkills),
	blocks: many(lessonBlocks)
}));

export const questionsRelations = relations(questions, ({ one, many }) => ({
	lesson: one(lessons, {
		fields: [questions.lessonId],
		references: [lessons.id]
	}),
	attempts: many(userQuestionAttempts),
	questionConcepts: many(questionConcepts)
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

export const weeklyChallengesRelations = relations(weeklyChallenges, ({ many }) => ({
	userChallenges: many(userChallenges)
}));

export const userChallengesRelations = relations(userChallenges, ({ one }) => ({
	user: one(users, {
		fields: [userChallenges.userId],
		references: [users.id]
	}),
	challenge: one(weeklyChallenges, {
		fields: [userChallenges.challengeId],
		references: [weeklyChallenges.id]
	})
}));

export const friendshipsRelations = relations(friendships, ({ one }) => ({
	requester: one(users, {
		fields: [friendships.requesterId],
		references: [users.id],
		relationName: 'requester'
	}),
	addressee: one(users, {
		fields: [friendships.addresseeId],
		references: [users.id],
		relationName: 'addressee'
	})
}));

export const shopItemsRelations = relations(shopItems, ({ many }) => ({
	purchases: many(userPurchases)
}));

export const userPurchasesRelations = relations(userPurchases, ({ one }) => ({
	user: one(users, {
		fields: [userPurchases.userId],
		references: [users.id]
	}),
	item: one(shopItems, {
		fields: [userPurchases.itemId],
		references: [shopItems.id]
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
export type Language = typeof languages.$inferSelect;
export type NewLanguage = typeof languages.$inferInsert;

// ─── Learning System Tables ─────────────────────────────────────────────────

export const concepts = pgTable(
	'concepts',
	{
		id: serial('id').primaryKey(),
		languageCode: varchar('language_code', { length: 10 })
			.references(() => languages.code, { onDelete: 'cascade' })
			.notNull(),
		type: conceptTypeEnum('type').notNull(),
		key: varchar('key', { length: 100 }).notNull(),
		titleEn: varchar('title_en', { length: 200 }).notNull(),
		titleDe: varchar('title_de', { length: 200 }).notNull(),
		descriptionEn: text('description_en'),
		descriptionDe: text('description_de'),
		data: jsonb('data').default({}).notNull(),
		cefrLevel: levelCodeEnum('cefr_level'),
		order: integer('order').default(0).notNull(),
		isActive: boolean('is_active').default(true).notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(table) => [
		unique('concepts_lang_key_unique').on(table.languageCode, table.key),
		index('concepts_language_code_idx').on(table.languageCode),
		index('concepts_type_idx').on(table.type)
	]
);

export const skills = pgTable(
	'skills',
	{
		id: serial('id').primaryKey(),
		languageCode: varchar('language_code', { length: 10 })
			.references(() => languages.code, { onDelete: 'cascade' })
			.notNull(),
		type: skillTypeEnum('type').notNull(),
		key: varchar('key', { length: 100 }).notNull(),
		titleEn: varchar('title_en', { length: 200 }).notNull(),
		titleDe: varchar('title_de', { length: 200 }).notNull(),
		descriptionEn: text('description_en'),
		descriptionDe: text('description_de'),
		cefrLevel: levelCodeEnum('cefr_level'),
		iconName: varchar('icon_name', { length: 50 }),
		order: integer('order').default(0).notNull(),
		isActive: boolean('is_active').default(true).notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull(),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(table) => [
		unique('skills_lang_key_unique').on(table.languageCode, table.key),
		index('skills_language_code_idx').on(table.languageCode),
		index('skills_type_idx').on(table.type)
	]
);

export const skillConcepts = pgTable(
	'skill_concepts',
	{
		id: serial('id').primaryKey(),
		skillId: integer('skill_id')
			.references(() => skills.id, { onDelete: 'cascade' })
			.notNull(),
		conceptId: integer('concept_id')
			.references(() => concepts.id, { onDelete: 'cascade' })
			.notNull(),
		role: varchar('role', { length: 20 }).default('core').notNull(),
		weight: integer('weight').default(1).notNull()
	},
	(table) => [
		unique('skill_concepts_unique').on(table.skillId, table.conceptId),
		index('skill_concepts_skill_id_idx').on(table.skillId),
		index('skill_concepts_concept_id_idx').on(table.conceptId)
	]
);

export const skillPrerequisites = pgTable(
	'skill_prerequisites',
	{
		id: serial('id').primaryKey(),
		skillId: integer('skill_id')
			.references(() => skills.id, { onDelete: 'cascade' })
			.notNull(),
		prerequisiteSkillId: integer('prerequisite_skill_id')
			.references(() => skills.id, { onDelete: 'cascade' })
			.notNull(),
		minMastery: real('min_mastery').default(0.8).notNull()
	},
	(table) => [
		unique('skill_prerequisites_unique').on(table.skillId, table.prerequisiteSkillId),
		index('skill_prerequisites_skill_id_idx').on(table.skillId)
	]
);

export const lessonSkills = pgTable(
	'lesson_skills',
	{
		id: serial('id').primaryKey(),
		lessonId: integer('lesson_id')
			.references(() => lessons.id, { onDelete: 'cascade' })
			.notNull(),
		skillId: integer('skill_id')
			.references(() => skills.id, { onDelete: 'cascade' })
			.notNull(),
		role: varchar('role', { length: 20 }).default('primary').notNull()
	},
	(table) => [
		unique('lesson_skills_unique').on(table.lessonId, table.skillId),
		index('lesson_skills_lesson_id_idx').on(table.lessonId),
		index('lesson_skills_skill_id_idx').on(table.skillId)
	]
);

export const questionConcepts = pgTable(
	'question_concepts',
	{
		id: serial('id').primaryKey(),
		questionId: integer('question_id')
			.references(() => questions.id, { onDelete: 'cascade' })
			.notNull(),
		conceptId: integer('concept_id')
			.references(() => concepts.id, { onDelete: 'cascade' })
			.notNull()
	},
	(table) => [
		unique('question_concepts_unique').on(table.questionId, table.conceptId),
		index('question_concepts_question_id_idx').on(table.questionId),
		index('question_concepts_concept_id_idx').on(table.conceptId)
	]
);

export const lessonBlocks = pgTable(
	'lesson_blocks',
	{
		id: serial('id').primaryKey(),
		lessonId: integer('lesson_id')
			.references(() => lessons.id, { onDelete: 'cascade' })
			.notNull(),
		blockType: lessonBlockTypeEnum('block_type').notNull(),
		order: integer('order').notNull(),
		titleEn: varchar('title_en', { length: 200 }),
		titleDe: varchar('title_de', { length: 200 }),
		config: jsonb('config').default({}).notNull(),
		isOptional: boolean('is_optional').default(false).notNull(),
		createdAt: timestamp('created_at').defaultNow().notNull()
	},
	(table) => [
		index('lesson_blocks_lesson_id_idx').on(table.lessonId),
		index('lesson_blocks_order_idx').on(table.lessonId, table.order)
	]
);

export const userConceptProgress = pgTable(
	'user_concept_progress',
	{
		id: serial('id').primaryKey(),
		userId: integer('user_id')
			.references(() => users.id, { onDelete: 'cascade' })
			.notNull(),
		conceptId: integer('concept_id')
			.references(() => concepts.id, { onDelete: 'cascade' })
			.notNull(),
		status: conceptProgressStatusEnum('status').default('new').notNull(),
		mastery: real('mastery').default(0).notNull(),
		easinessFactor: real('easiness_factor').default(2.5).notNull(),
		intervalDays: real('interval_days').default(1).notNull(),
		repetitions: integer('repetitions').default(0).notNull(),
		totalAttempts: integer('total_attempts').default(0).notNull(),
		correctAttempts: integer('correct_attempts').default(0).notNull(),
		nextReviewAt: timestamp('next_review_at'),
		lastReviewedAt: timestamp('last_reviewed_at'),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(table) => [
		unique('user_concept_progress_unique').on(table.userId, table.conceptId),
		index('user_concept_progress_user_id_idx').on(table.userId),
		index('user_concept_progress_due_idx').on(table.userId, table.nextReviewAt)
	]
);

export const userSkillProgress = pgTable(
	'user_skill_progress',
	{
		id: serial('id').primaryKey(),
		userId: integer('user_id')
			.references(() => users.id, { onDelete: 'cascade' })
			.notNull(),
		skillId: integer('skill_id')
			.references(() => skills.id, { onDelete: 'cascade' })
			.notNull(),
		status: skillStatusEnum('status').default('locked').notNull(),
		mastery: real('mastery').default(0).notNull(),
		unlockedAt: timestamp('unlocked_at'),
		masteredAt: timestamp('mastered_at'),
		updatedAt: timestamp('updated_at').defaultNow().notNull()
	},
	(table) => [
		unique('user_skill_progress_unique').on(table.userId, table.skillId),
		index('user_skill_progress_user_id_idx').on(table.userId),
		index('user_skill_progress_skill_id_idx').on(table.skillId)
	]
);

export const placementSessions = pgTable(
	'placement_sessions',
	{
		id: serial('id').primaryKey(),
		userId: integer('user_id')
			.references(() => users.id, { onDelete: 'cascade' })
			.notNull(),
		languageCode: varchar('language_code', { length: 10 })
			.references(() => languages.code, { onDelete: 'cascade' })
			.notNull(),
		estimatedLevel: varchar('estimated_level', { length: 10 }),
		totalQuestions: integer('total_questions').default(0).notNull(),
		correctCount: integer('correct_count').default(0).notNull(),
		data: jsonb('data').default({}).notNull(),
		completedAt: timestamp('completed_at'),
		createdAt: timestamp('created_at').defaultNow().notNull()
	},
	(table) => [
		index('placement_sessions_user_id_idx').on(table.userId),
		index('placement_sessions_language_code_idx').on(table.languageCode)
	]
);

// ─── Learning System Relations ──────────────────────────────────────────────

export const conceptsRelations = relations(concepts, ({ one, many }) => ({
	language: one(languages, {
		fields: [concepts.languageCode],
		references: [languages.code]
	}),
	skillConcepts: many(skillConcepts),
	questionConcepts: many(questionConcepts),
	userProgress: many(userConceptProgress)
}));

export const skillsRelations = relations(skills, ({ one, many }) => ({
	language: one(languages, {
		fields: [skills.languageCode],
		references: [languages.code]
	}),
	skillConcepts: many(skillConcepts),
	prerequisites: many(skillPrerequisites, { relationName: 'skillPrereqs' }),
	dependents: many(skillPrerequisites, { relationName: 'prereqFor' }),
	lessonSkills: many(lessonSkills),
	userProgress: many(userSkillProgress)
}));

export const skillConceptsRelations = relations(skillConcepts, ({ one }) => ({
	skill: one(skills, {
		fields: [skillConcepts.skillId],
		references: [skills.id]
	}),
	concept: one(concepts, {
		fields: [skillConcepts.conceptId],
		references: [concepts.id]
	})
}));

export const skillPrerequisitesRelations = relations(skillPrerequisites, ({ one }) => ({
	skill: one(skills, {
		fields: [skillPrerequisites.skillId],
		references: [skills.id],
		relationName: 'skillPrereqs'
	}),
	prerequisite: one(skills, {
		fields: [skillPrerequisites.prerequisiteSkillId],
		references: [skills.id],
		relationName: 'prereqFor'
	})
}));

export const lessonSkillsRelations = relations(lessonSkills, ({ one }) => ({
	lesson: one(lessons, {
		fields: [lessonSkills.lessonId],
		references: [lessons.id]
	}),
	skill: one(skills, {
		fields: [lessonSkills.skillId],
		references: [skills.id]
	})
}));

export const questionConceptsRelations = relations(questionConcepts, ({ one }) => ({
	question: one(questions, {
		fields: [questionConcepts.questionId],
		references: [questions.id]
	}),
	concept: one(concepts, {
		fields: [questionConcepts.conceptId],
		references: [concepts.id]
	})
}));

export const lessonBlocksRelations = relations(lessonBlocks, ({ one }) => ({
	lesson: one(lessons, {
		fields: [lessonBlocks.lessonId],
		references: [lessons.id]
	})
}));

export const userConceptProgressRelations = relations(userConceptProgress, ({ one }) => ({
	user: one(users, {
		fields: [userConceptProgress.userId],
		references: [users.id]
	}),
	concept: one(concepts, {
		fields: [userConceptProgress.conceptId],
		references: [concepts.id]
	})
}));

export const userSkillProgressRelations = relations(userSkillProgress, ({ one }) => ({
	user: one(users, {
		fields: [userSkillProgress.userId],
		references: [users.id]
	}),
	skill: one(skills, {
		fields: [userSkillProgress.skillId],
		references: [skills.id]
	})
}));

export const placementSessionsRelations = relations(placementSessions, ({ one }) => ({
	user: one(users, {
		fields: [placementSessions.userId],
		references: [users.id]
	})
}));

// ─── Learning System Type Exports ───────────────────────────────────────────

export type Concept = typeof concepts.$inferSelect;
export type NewConcept = typeof concepts.$inferInsert;
export type Skill = typeof skills.$inferSelect;
export type NewSkill = typeof skills.$inferInsert;
export type SkillConcept = typeof skillConcepts.$inferSelect;
export type SkillPrerequisite = typeof skillPrerequisites.$inferSelect;
export type LessonSkill = typeof lessonSkills.$inferSelect;
export type QuestionConcept = typeof questionConcepts.$inferSelect;
export type LessonBlock = typeof lessonBlocks.$inferSelect;
export type NewLessonBlock = typeof lessonBlocks.$inferInsert;
export type UserConceptProgress = typeof userConceptProgress.$inferSelect;
export type UserSkillProgress = typeof userSkillProgress.$inferSelect;
export type PlacementSession = typeof placementSessions.$inferSelect;
export type ConceptType = (typeof conceptTypeEnum.enumValues)[number];
export type SkillType = (typeof skillTypeEnum.enumValues)[number];
export type SkillStatus = (typeof skillStatusEnum.enumValues)[number];
export type LessonMode = (typeof lessonModeEnum.enumValues)[number];
export type LessonBlockType = (typeof lessonBlockTypeEnum.enumValues)[number];
export type ConceptProgressStatus = (typeof conceptProgressStatusEnum.enumValues)[number];

// ─── Gamification Type Exports ──────────────────────────────────────────────

export type WeeklyChallenge = typeof weeklyChallenges.$inferSelect;
export type NewWeeklyChallenge = typeof weeklyChallenges.$inferInsert;
export type UserChallenge = typeof userChallenges.$inferSelect;
export type Friendship = typeof friendships.$inferSelect;
export type ShopItem = typeof shopItems.$inferSelect;
export type UserPurchase = typeof userPurchases.$inferSelect;
export type FriendshipStatus = (typeof friendshipStatusEnum.enumValues)[number];
export type ChallengeType = (typeof challengeTypeEnum.enumValues)[number];
