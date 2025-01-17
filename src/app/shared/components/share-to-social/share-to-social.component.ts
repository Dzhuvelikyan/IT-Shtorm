import {Component, Input} from '@angular/core';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-share-to-social',
  standalone: false,
  templateUrl: './share-to-social.component.html',
  styleUrl: './share-to-social.component.scss'
})
export class ShareToSocialComponent {
  @Input() articleUrl!: string;
  @Input() articleTitle!: string;

  socialNetworkUrl = {
    vk: {name: 'vk', url: environment.vk},
    instagram: {name: 'facebook', url: environment.facebook},
    facebook: {name: 'instagram', url: environment.instagram},
  }

  shareToSocial(socialNetworkUrl: string): void {

    // кодирование спец. символов для безопасно использована в качестве значения параметра URL.
    const articleUrl = encodeURIComponent(`${environment.api}/${this.articleUrl}`);
    const articleTitle = encodeURIComponent(this.articleTitle);

    let shareUrl = '';

    switch (socialNetworkUrl) {

      case (this.socialNetworkUrl.vk.name):
        shareUrl = `${this.socialNetworkUrl.vk.url}share.php?url=${articleUrl}&title=${articleTitle}&noparse=true`;
        break;

      case (this.socialNetworkUrl.facebook.name):
        shareUrl = `${this.socialNetworkUrl.facebook.url}`;
        break;

      case (this.socialNetworkUrl.instagram.name):
        shareUrl = `${this.socialNetworkUrl.instagram.url}`;
        break;

      default:
        console.error('Не поддерживаемая социальная сеть:', socialNetworkUrl);
        return;
    }

    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  }
}
