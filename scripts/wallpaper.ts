import { NationalGeographicAPI } from '../src';
import { execSync } from 'child_process';
import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

async function main() {
  console.log('Fetching NatGeo Photo of the Day...');

  const photo = await NationalGeographicAPI.getPhotoOfDay();

  console.log(`Title       : ${photo.title}`);
  console.log(`Description : ${photo.description.slice(0, 120)}...`);
  console.log(`Image URL   : ${photo.imageUrl}`);

  // Download image
  const dir = join(homedir(), '.local', 'share', 'natgeo-wallpaper');
  mkdirSync(dir, { recursive: true });

  const ext = new URL(photo.imageUrl).pathname.match(/\.\w+$/)?.[0] ?? '.jpg';
  const filePath = join(dir, `wallpaper${ext}`);

  const response = await fetch(photo.imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
  }

  const buffer = await response.arrayBuffer();
  writeFileSync(filePath, Buffer.from(buffer));
  console.log(`Saved       : ${filePath}`);

  // Set GNOME wallpaper (covers both light and dark mode)
  const fileUri = `file://${filePath}`;
  execSync(`gsettings set org.gnome.desktop.background picture-uri "${fileUri}"`);
  execSync(`gsettings set org.gnome.desktop.background picture-options "zoom"`);
  // picture-uri-dark exists in GNOME 42+ — skip silently if unavailable
  try {
    execSync(`gsettings set org.gnome.desktop.background picture-uri-dark "${fileUri}"`, { stdio: 'ignore' });
  } catch {
    // not available on this GNOME version, no action needed
  }

  console.log('Wallpaper updated!');
}

main().catch((err: Error) => {
  console.error(`Error: ${err.message}`);
  process.exit(1);
});
