import {
  Component,
  ElementRef,
  ViewChild,
  OnDestroy,
  Inject,
  PLATFORM_ID,
  afterNextRender
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Star } from '../../models/link/star';

@Component({
  selector: 'app-background',
  templateUrl: './background.html',
  styleUrl: './background.css',
})
export class Background implements OnDestroy {

  @ViewChild('starsCanvas', { static: false })
  canvasRef!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private stars: Star[] = [];
  private animationId = 0;
  private resizeObserver?: ResizeObserver;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    if (isPlatformBrowser(platformId)) {
      afterNextRender(() => this.init());
    }
  }

  private init(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    this.ctx = ctx;

    this.resizeCanvas();
    this.initStars();
    this.animate();

    this.resizeObserver = new ResizeObserver(() => {
      this.resizeCanvas();
    });
    this.resizeObserver.observe(document.body);
  }

  ngOnDestroy(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
    this.resizeObserver?.disconnect();
  }

  private resizeCanvas(): void {
    if (!this.canvasRef) return;

    const canvas = this.canvasRef.nativeElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  private initStars(): void {
    const starCount = Math.floor(
      (window.innerWidth * window.innerHeight) / 8000
    );

    this.stars = [];
    for (let i = 0; i < starCount; i++) {
      this.stars.push(this.createStar());
    }
  }

  private createStar(atTop = false): Star {
    const canvas = this.canvasRef.nativeElement;

    return {
      x: Math.random() * canvas.width,
      y: atTop ? -10 : Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speed: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.8 + 0.2,
      tail: Math.random() * 30 + 20,
    };
  }

  private animate = (): void => {
    const canvas = this.canvasRef.nativeElement;

    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < this.stars.length; i++) {
      const star = this.stars[i];

      const gradient = this.ctx.createLinearGradient(
        star.x, star.y - star.tail,
        star.x, star.y
      );
      gradient.addColorStop(0, 'rgba(255,255,255,0)');
      gradient.addColorStop(1, `rgba(255,255,255,${star.opacity})`);

      this.ctx.beginPath();
      this.ctx.strokeStyle = gradient;
      this.ctx.lineWidth = star.size * 0.5;
      this.ctx.moveTo(star.x, star.y - star.tail);
      this.ctx.lineTo(star.x, star.y);
      this.ctx.stroke();

      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(255,255,255,${star.opacity})`;
      this.ctx.fill();

      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.size * 2, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(200,180,255,${star.opacity * 0.3})`;
      this.ctx.fill();

      star.y += star.speed;

      if (star.y > canvas.height + star.tail) {
        this.stars[i] = this.createStar(true);
      }
    }

    this.animationId = requestAnimationFrame(this.animate);
  };
}
