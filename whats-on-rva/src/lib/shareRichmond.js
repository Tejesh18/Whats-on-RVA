const origin = () =>
  typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : '';

export function storyShareUrl(slug) {
  return `${origin()}#story/${slug}`;
}

export async function shareText({ title, text, url }) {
  try {
    if (navigator.share) {
      await navigator.share({ title, text, url });
      return true;
    }
    await navigator.clipboard.writeText(`${text}\n${url}`);
    return 'clipboard';
  } catch {
    return false;
  }
}

export async function shareStory(slug, storyTitle) {
  const url = storyShareUrl(slug);
  return shareText({
    title: storyTitle || 'Richmond story',
    text: `Neighborhood story: ${storyTitle || slug}`,
    url,
  });
}

export async function shareItinerary(lines, title = 'My Richmond night') {
  const body = lines.join('\n');
  return shareText({ title, text: body, url: origin() });
}

export async function shareTrail(name, lines) {
  const body = [`Trail: ${name}`, ...lines].join('\n');
  return shareText({ title: name, text: body, url: origin() });
}
