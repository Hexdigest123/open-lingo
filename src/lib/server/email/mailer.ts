import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

// Email configuration from environment variables
const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587');
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM || 'OpenLingo <noreply@openlingo.app>';
const APP_URL = process.env.PUBLIC_APP_URL || 'http://localhost:5173';

/**
 * Escape HTML entities to prevent XSS in email templates
 */
function escapeHtml(unsafe: string): string {
	return unsafe
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}

let transporter: Transporter | null = null;

/**
 * Check if email is configured
 */
export function isEmailConfigured(): boolean {
	return !!(SMTP_HOST && SMTP_USER && SMTP_PASS);
}

/**
 * Get or create the email transporter
 */
function getTransporter(): Transporter | null {
	if (!isEmailConfigured()) {
		console.warn('Email not configured. Set SMTP_HOST, SMTP_USER, and SMTP_PASS environment variables.');
		return null;
	}

	if (!transporter) {
		transporter = nodemailer.createTransport({
			host: SMTP_HOST,
			port: SMTP_PORT,
			secure: SMTP_PORT === 465,
			auth: {
				user: SMTP_USER,
				pass: SMTP_PASS
			}
		});
	}

	return transporter;
}

/**
 * Send an email
 */
async function sendEmail(to: string, subject: string, html: string, text?: string): Promise<boolean> {
	const transport = getTransporter();
	if (!transport) {
		console.log(`[Email] Would send to ${to}: ${subject}`);
		return false;
	}

	try {
		await transport.sendMail({
			from: SMTP_FROM,
			to,
			subject,
			html,
			text: text || html.replace(/<[^>]*>/g, '')
		});
		console.log(`[Email] Sent to ${to}: ${subject}`);
		return true;
	} catch (error) {
		console.error('[Email] Failed to send:', error);
		return false;
	}
}

/**
 * Send an invitation email
 */
export async function sendInvitationEmail(to: string, code: string, inviterName?: string): Promise<boolean> {
	const inviteUrl = `${APP_URL}/register?invite=${code}`;

	const subject = 'You\'ve been invited to OpenLingo!';
	const html = `
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
		</head>
		<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #3c3c3c; max-width: 600px; margin: 0 auto; padding: 20px;">
			<div style="text-align: center; margin-bottom: 30px;">
				<h1 style="color: #58cc02; margin: 0;">OpenLingo</h1>
				<p style="color: #6b7280; margin-top: 5px;">Learn Spanish the fun way</p>
			</div>

			<div style="background: #f7f7f7; border-radius: 12px; padding: 30px; margin-bottom: 20px;">
				<h2 style="margin-top: 0; color: #3c3c3c;">You're Invited!</h2>
				<p>${inviterName ? `<strong>${escapeHtml(inviterName)}</strong> has invited you to join OpenLingo.` : 'You\'ve been invited to join OpenLingo.'}</p>
				<p>Start learning Spanish today with AI-powered lessons, voice practice, and gamification.</p>

				<div style="text-align: center; margin: 30px 0;">
					<a href="${inviteUrl}" style="display: inline-block; background: #58cc02; color: white; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: bold; font-size: 16px;">
						Accept Invitation
					</a>
				</div>

				<p style="color: #6b7280; font-size: 14px;">Or copy this link: <a href="${inviteUrl}" style="color: #1cb0f6;">${inviteUrl}</a></p>
			</div>

			<p style="color: #6b7280; font-size: 12px; text-align: center;">
				If you didn't expect this invitation, you can safely ignore this email.
			</p>
		</body>
		</html>
	`;

	return sendEmail(to, subject, html);
}

/**
 * Send approval notification email
 */
export async function sendApprovalNotificationEmail(to: string, displayName: string): Promise<boolean> {
	const loginUrl = `${APP_URL}/login`;

	const subject = 'Your OpenLingo account has been approved!';
	const html = `
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
		</head>
		<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #3c3c3c; max-width: 600px; margin: 0 auto; padding: 20px;">
			<div style="text-align: center; margin-bottom: 30px;">
				<h1 style="color: #58cc02; margin: 0;">OpenLingo</h1>
				<p style="color: #6b7280; margin-top: 5px;">Learn Spanish the fun way</p>
			</div>

			<div style="background: #f7f7f7; border-radius: 12px; padding: 30px; margin-bottom: 20px;">
				<h2 style="margin-top: 0; color: #3c3c3c;">Welcome, ${escapeHtml(displayName)}!</h2>
				<p>Great news! Your OpenLingo account has been approved by an administrator.</p>
				<p>You can now log in and start your Spanish learning journey.</p>

				<div style="text-align: center; margin: 30px 0;">
					<a href="${loginUrl}" style="display: inline-block; background: #58cc02; color: white; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: bold; font-size: 16px;">
						Start Learning
					</a>
				</div>
			</div>

			<p style="color: #6b7280; font-size: 12px; text-align: center;">
				Happy learning!<br>The OpenLingo Team
			</p>
		</body>
		</html>
	`;

	return sendEmail(to, subject, html);
}

/**
 * Send rejection notification email
 */
export async function sendRejectionNotificationEmail(to: string, displayName: string): Promise<boolean> {
	const subject = 'OpenLingo account update';
	const html = `
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
		</head>
		<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #3c3c3c; max-width: 600px; margin: 0 auto; padding: 20px;">
			<div style="text-align: center; margin-bottom: 30px;">
				<h1 style="color: #58cc02; margin: 0;">OpenLingo</h1>
				<p style="color: #6b7280; margin-top: 5px;">Learn Spanish the fun way</p>
			</div>

			<div style="background: #f7f7f7; border-radius: 12px; padding: 30px; margin-bottom: 20px;">
				<h2 style="margin-top: 0; color: #3c3c3c;">Hello, ${escapeHtml(displayName)}</h2>
				<p>We're sorry to inform you that your account registration request was not approved at this time.</p>
				<p>If you believe this was a mistake or have questions, please contact the administrator.</p>
			</div>

			<p style="color: #6b7280; font-size: 12px; text-align: center;">
				The OpenLingo Team
			</p>
		</body>
		</html>
	`;

	return sendEmail(to, subject, html);
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(to: string, resetToken: string): Promise<boolean> {
	const resetUrl = `${APP_URL}/reset-password?token=${resetToken}`;

	const subject = 'Reset your OpenLingo password';
	const html = `
		<!DOCTYPE html>
		<html>
		<head>
			<meta charset="utf-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
		</head>
		<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #3c3c3c; max-width: 600px; margin: 0 auto; padding: 20px;">
			<div style="text-align: center; margin-bottom: 30px;">
				<h1 style="color: #58cc02; margin: 0;">OpenLingo</h1>
				<p style="color: #6b7280; margin-top: 5px;">Learn Spanish the fun way</p>
			</div>

			<div style="background: #f7f7f7; border-radius: 12px; padding: 30px; margin-bottom: 20px;">
				<h2 style="margin-top: 0; color: #3c3c3c;">Password Reset Request</h2>
				<p>We received a request to reset your password. Click the button below to create a new password:</p>

				<div style="text-align: center; margin: 30px 0;">
					<a href="${resetUrl}" style="display: inline-block; background: #1cb0f6; color: white; text-decoration: none; padding: 14px 28px; border-radius: 12px; font-weight: bold; font-size: 16px;">
						Reset Password
					</a>
				</div>

				<p style="color: #6b7280; font-size: 14px;">This link will expire in 1 hour.</p>
				<p style="color: #6b7280; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
			</div>

			<p style="color: #6b7280; font-size: 12px; text-align: center;">
				The OpenLingo Team
			</p>
		</body>
		</html>
	`;

	return sendEmail(to, subject, html);
}

/**
 * Test the email configuration
 */
export async function testEmailConfiguration(): Promise<{ success: boolean; error?: string }> {
	if (!isEmailConfigured()) {
		return { success: false, error: 'Email not configured. Missing SMTP environment variables.' };
	}

	const transport = getTransporter();
	if (!transport) {
		return { success: false, error: 'Failed to create email transporter.' };
	}

	try {
		await transport.verify();
		return { success: true };
	} catch (error) {
		return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
	}
}
