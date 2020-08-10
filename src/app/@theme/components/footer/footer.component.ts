import { Component } from '@angular/core';

@Component({
  selector: 'ngx-footer',
  styleUrls: ['./footer.component.scss'],
  template: `
    <span class="created-by">Criado por <b>Felipe Gonzaga</b> 2020</span>
    <div class="socials">
      <a href="https://www.facebook.com/fgasilva" target="_blank" class="ion ion-social-facebook"></a>
      <a href="https://www.instagram.com/felipe.gonzaga_" target="_blank" class="ion ion-social-instagram"></a>
      <a href="https://www.linkedin.com/in/felipegonzaga" target="_blank" class="ion ion-social-linkedin"></a>
    </div>
  `,
})
export class FooterComponent {
}
