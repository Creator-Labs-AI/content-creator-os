export async function publishLinkedInPost(
	content: string,
): Promise<{ success: boolean; message: string; shareUrl: string }> {
	const encodedContent = encodeURIComponent(content);
	const shareUrl = `https://www.linkedin.com/feed/?shareActive=true&text=${encodedContent}`;

	return {
		success: true,
		message: 'Opening LinkedIn with your post. Please review and click Post.',
		shareUrl,
	};
}
