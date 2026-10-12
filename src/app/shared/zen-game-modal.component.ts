import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  NgZone,
  OnDestroy,
  ViewChild,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PROFILE } from '../data';

interface Block {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  label: string;
}

@Component({
  selector: 'app-zen-game-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Floating Relax Pill -->
    <button
      class="hud-trigger glass-panel"
      (click)="openModal()"
      aria-label="Play Zen Builder"
      type="button"
    >
      <span class="hud-sparkle">✨</span>
      <span class="hud-label">Take a Breather & Build</span>
      <kbd class="hud-kbd">Ctrl K</kbd>
    </button>

    <!-- Modal Backdrop -->
    @if (isOpen()) {
      <div class="zen-backdrop" (click)="closeModal()">
        <div class="zen-window glass-panel" (click)="$event.stopPropagation()">
          
          <!-- Header -->
          <div class="zen-bar">
            <div class="bar-title">
              <span class="pulse-indicator"></span>
              <span>Zen Architect &bull; Stack the Ideal Dev</span>
            </div>
            <button class="close-btn" (click)="closeModal()" aria-label="Close">✕</button>
          </div>

          <!-- Gameplay Viewport -->
          <div class="canvas-wrapper">
            <canvas
              #gameCanvas
              (pointerdown)="onCanvasAction()"
              [class.pointer-active]="!isGameOver()"
            ></canvas>

            <!-- Active Score HUD -->
            <div class="hud-overlay">
              <span class="score-chip">Height: <strong>{{ stackCount() }}</strong> floors</span>
              @if (currentCombo() > 1) {
                <span class="combo-chip">🔥 Perfect Drop x{{ currentCombo() }}!</span>
              }
            </div>

            <!-- Pre-Start Helper -->
            @if (!gameStarted()) {
              <div class="tap-hint" (pointerdown)="onCanvasAction()">
                <div class="tap-icon">🎯</div>
                <p>Click, tap, or press <strong>Space</strong> to drop the block!</p>
                <span class="sub">Stack skills. Align perfectly. Build your tech stack.</span>
              </div>
            }

            <!-- Victory / Game Over Overlay -->
            @if (isGameOver()) {
              <div class="modal-end glass-panel">
                <span class="badge-tag">PROJECT BLUEPRINT READY</span>
                <h2>{{ getResultHeading() }}</h2>
                <p class="summary-text">{{ getResultSummary() }}</p>

                <div class="stats-grid">
                  <div class="stat-box">
                    <span class="stat-num">{{ stackCount() }}</span>
                    <span class="stat-desc">Tech Modules Stacked</span>
                  </div>
                  <div class="stat-box">
                    <span class="stat-num">{{ perfectionScore() }}%</span>
                    <span class="stat-desc">Architecture Precision</span>
                  </div>
                </div>

                <div class="cta-actions">
                  <a
                    class="btn btn-primary"
                    [href]="'mailto:' + profile.email + '?subject=' + encodeCTA('Project Inquiry')"
                    (click)="closeModal()"
                  >
                    ✉️ Let's Build This For Real
                  </a>
                  <button class="btn btn-ghost" (click)="restartGame()">
                    🔄 Stack Another
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    /* Floating Launch Pill */
    .hud-trigger {
      position: fixed;
      bottom: 1.75rem;
      right: 1.75rem;
      z-index: 998;
      display: inline-flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.7rem 1.25rem;
      cursor: pointer;
      border-radius: 999px;
      font-size: 0.88rem;
      font-weight: 600;
      color: #38bdf8;
      border: 1px solid rgba(6, 182, 212, 0.4);
      background: rgba(14, 17, 24, 0.85);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 15px rgba(6, 182, 212, 0.2);
      transition: all 0.25s ease;
    }
    .hud-trigger:hover {
      transform: translateY(-3px) scale(1.02);
      border-color: #06b6d4;
      box-shadow: 0 12px 35px rgba(0, 0, 0, 0.6), 0 0 25px rgba(6, 182, 212, 0.45);
    }
    .hud-sparkle {
      animation: spin 3s ease-in-out infinite alternate;
    }
    .hud-kbd {
      padding: 0.15rem 0.45rem;
      border-radius: 4px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      color: #94a3b8;
      font-family: var(--font-mono, monospace);
      font-size: 0.72rem;
    }

    /* Modal Backdrop */
    .zen-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(5, 7, 12, 0.82);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      z-index: 10000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      animation: fadeIn 0.2s ease-out;
    }

    .zen-window {
      width: 100%;
      max-width: 540px;
      height: 640px;
      display: flex;
      flex-direction: column;
      border-radius: 20px;
      border: 1px solid rgba(99, 102, 241, 0.35);
      background: rgba(12, 15, 24, 0.96);
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.9), 0 0 40px rgba(99, 102, 241, 0.25);
      overflow: hidden;
      position: relative;
    }

    .zen-bar {
      height: 48px;
      padding: 0 1.25rem;
      background: rgba(255, 255, 255, 0.03);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .bar-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.86rem;
      font-weight: 600;
      color: #cbd5e1;
    }
    .pulse-indicator {
      width: 7px;
      height: 7px;
      background: #06b6d4;
      border-radius: 50%;
      box-shadow: 0 0 8px #06b6d4;
    }
    .close-btn {
      background: transparent;
      border: none;
      color: #94a3b8;
      font-size: 1.1rem;
      cursor: pointer;
      transition: color 0.2s;
    }
    .close-btn:hover { color: #fff; }

    .canvas-wrapper {
      flex: 1;
      position: relative;
      overflow: hidden;
    }
    canvas {
      width: 100%;
      height: 100%;
      display: block;
    }
    canvas.pointer-active { cursor: pointer; }

    .hud-overlay {
      position: absolute;
      top: 1rem;
      left: 1rem;
      right: 1rem;
      display: flex;
      justify-content: space-between;
      pointer-events: none;
      font-family: var(--font-mono, monospace);
    }
    .score-chip {
      padding: 0.35rem 0.85rem;
      background: rgba(10, 13, 22, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 999px;
      font-size: 0.85rem;
      color: #f8fafc;
    }
    .score-chip strong { color: #06b6d4; }
    .combo-chip {
      padding: 0.35rem 0.85rem;
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid rgba(245, 158, 11, 0.4);
      border-radius: 999px;
      font-size: 0.8rem;
      color: #fbbf24;
      font-weight: 600;
      animation: pulse 1s infinite alternate;
    }

    .tap-hint {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      text-align: center;
      padding: 2rem;
      pointer-events: all;
      cursor: pointer;
      background: rgba(5, 7, 12, 0.4);
    }
    .tap-icon { font-size: 2.5rem; animation: bounce 1.8s infinite; }
    .tap-hint p { font-size: 1.1rem; color: #fff; font-weight: 600; margin: 0; }
    .tap-hint .sub { font-size: 0.85rem; color: #94a3b8; }

    .modal-end {
      position: absolute;
      inset: 1.5rem;
      padding: 2rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      background: rgba(15, 20, 32, 0.94);
      border: 1px solid rgba(99, 102, 241, 0.4);
      animation: popIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .badge-tag {
      font-family: var(--font-mono, monospace);
      font-size: 0.72rem;
      color: #34d399;
      background: rgba(16, 185, 129, 0.1);
      border: 1px solid rgba(16, 185, 129, 0.3);
      padding: 0.2rem 0.65rem;
      border-radius: 999px;
      margin-bottom: 0.75rem;
    }
    .modal-end h2 { font-size: 1.6rem; color: #fff; margin-bottom: 0.4rem; }
    .summary-text { color: #94a3b8; font-size: 0.92rem; line-height: 1.5; margin-bottom: 1.5rem; }

    .stats-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      width: 100%;
      margin-bottom: 1.75rem;
    }
    .stat-box {
      padding: 0.75rem;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
    }
    .stat-num { display: block; font-size: 1.5rem; font-weight: 700; color: #06b6d4; font-family: var(--font-mono, monospace); }
    .stat-desc { font-size: 0.75rem; color: #64748b; }

    .cta-actions { display: flex; flex-direction: column; gap: 0.65rem; width: 100%; }

    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(25deg); } }
    @keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes popIn { from { transform: scale(0.92); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  `],
})
export class ZenGameModalComponent implements AfterViewInit, OnDestroy {
  readonly profile = PROFILE;
  readonly isOpen = signal(false);
  readonly gameStarted = signal(false);
  readonly isGameOver = signal(false);
  readonly stackCount = signal(0);
  readonly currentCombo = signal(0);
  readonly perfectionScore = signal(100);

  @ViewChild('gameCanvas') private canvasRef?: ElementRef<HTMLCanvasElement>;

  private ctx?: CanvasRenderingContext2D;
  private animId = 0;
  private width = 480;
  private height = 580;

  // Game Attributes
  private readonly blockHeight = 36;
  private stack: Block[] = [];
  private currentBlock: Block = { x: 0, y: 0, width: 220, height: 36, color: '#6366f1', label: 'Angular 19 Core' };
  private moveSpeed = 3.2;
  private direction = 1;
  private perfectCount = 0;

  // Deck of skills & employer-friendly tags
  private readonly labels = [
    'Clean Architecture',
    'Angular 19 Signals',
    'TypeScript Mastery',
    'Reactive RxJS Streams',
    'Reusable UI Components',
    'REST API Integration',
    'Scalable SCSS Design',
    'Cross-Browser Reliability',
    'Zero Memory Leaks',
    'Agile Collaboration',
    'On-Time Delivery',
    'Production Polish',
  ];

  private readonly colors = [
    '#6366f1', '#4f46e5', '#06b6d4', '#0284c7',
    '#38bdf8', '#10b981', '#059669', '#a855f7',
    '#9333ea', '#ec4899', '#f43f5e',
  ];

  constructor(private readonly zone: NgZone) {}

  @HostListener('window:keydown', ['$event'])
  onKey(e: KeyboardEvent): void {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      this.toggleModal();
      return;
    }
    if (e.key === 'Escape' && this.isOpen()) {
      this.closeModal();
      return;
    }
    if (e.code === 'Space' && this.isOpen()) {
      e.preventDefault();
      this.onCanvasAction();
    }
  }

  openModal(): void {
    this.isOpen.set(true);
    setTimeout(() => {
      this.setupCanvas();
      this.restartGame();
    }, 50);
  }

  closeModal(): void {
    cancelAnimationFrame(this.animId);
    this.isOpen.set(false);
  }

  toggleModal(): void {
    this.isOpen() ? this.closeModal() : this.openModal();
  }

  onCanvasAction(): void {
    if (this.isGameOver()) return;

    if (!this.gameStarted()) {
      this.gameStarted.set(true);
      return;
    }

    this.dropBlock();
  }

  ngAfterViewInit(): void {
    if (this.isOpen()) this.setupCanvas();
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.animId);
  }

  private setupCanvas(): void {
    if (!this.canvasRef) return;
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;

    const rect = canvas.getBoundingClientRect();
    this.width = rect.width || 480;
    this.height = rect.height || 580;

    canvas.width = this.width * window.devicePixelRatio;
    canvas.height = this.height * window.devicePixelRatio;
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  restartGame(): void {
    this.gameStarted.set(false);
    this.isGameOver.set(false);
    this.stackCount.set(0);
    this.currentCombo.set(0);
    this.perfectCount = 0;
    this.moveSpeed = 3.2;

    const baseWidth = Math.min(240, this.width * 0.55);
    const baseY = this.height - 60;
    const baseX = (this.width - baseWidth) / 2;

    // Base foundational foundation
    this.stack = [
      {
        x: baseX,
        y: baseY,
        width: baseWidth,
        height: this.blockHeight,
        color: '#6366f1',
        label: 'Engineering Foundation',
      },
    ];

    this.spawnNextBlock(baseWidth, baseY - this.blockHeight);

    cancelAnimationFrame(this.animId);
    this.zone.runOutsideAngular(() => this.loop());
  }

  private spawnNextBlock(width: number, y: number): void {
    const nextIdx = this.stack.length;
    const label = this.labels[(nextIdx - 1) % this.labels.length];
    const color = this.colors[(nextIdx - 1) % this.colors.length];

    this.currentBlock = {
      x: 0,
      y,
      width,
      height: this.blockHeight,
      color,
      label,
    };
    this.direction = 1;
    this.moveSpeed = Math.min(3.2 + nextIdx * 0.18, 7.5);
  }

  private dropBlock(): void {
    const top = this.stack[this.stack.length - 1];
    const current = this.currentBlock;
    const diff = current.x - top.x;

    // Tolerance for snapping (perfect alignment)
    if (Math.abs(diff) < 4) {
      current.x = top.x; // Perfect snap!
      this.perfectCount++;
      this.currentCombo.update((c) => c + 1);
    } else {
      this.currentCombo.set(0);

      if (diff > 0) {
        // Overhang on the right
        current.width -= diff;
      } else {
        // Overhang on the left
        current.x = top.x;
        current.width += diff;
      }
    }

    // Missed completely or shrank to 0
    if (current.width <= 0) {
      this.endGame();
      return;
    }

    this.stack.push({ ...current });
    this.stackCount.set(this.stack.length - 1);

    // Camera shift downward once the tower gets high
    if (current.y < this.height * 0.45) {
      for (const b of this.stack) {
        b.y += this.blockHeight;
      }
      current.y += this.blockHeight;
    }

    this.spawnNextBlock(current.width, current.y - this.blockHeight);
  }

  private loop(): void {
    if (!this.ctx) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw background grid lines (subtle blueprint aesthetic)
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    this.ctx.lineWidth = 1;
    for (let y = 0; y < this.height; y += 30) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
      this.ctx.stroke();
    }

    // Draw stacked blocks
    for (const b of this.stack) {
      this.drawBlock(b);
    }

    // Update and draw active moving block
    if (this.gameStarted() && !this.isGameOver()) {
      this.currentBlock.x += this.moveSpeed * this.direction;
      if (this.currentBlock.x + this.currentBlock.width >= this.width) {
        this.direction = -1;
      } else if (this.currentBlock.x <= 0) {
        this.direction = 1;
      }
      this.drawBlock(this.currentBlock, true);
    }

    this.animId = requestAnimationFrame(() => this.loop());
  }

  private drawBlock(b: Block, isActive = false): void {
    if (!this.ctx) return;

    this.ctx.save();
    this.ctx.fillStyle = b.color;
    this.ctx.shadowColor = b.color;
    this.ctx.shadowBlur = isActive ? 16 : 6;

    // Rounded card geometry
    const r = 6;
    this.ctx.beginPath();
    this.ctx.roundRect(b.x, b.y, b.width, b.height, [r, r, r, r]);
    this.ctx.fill();

    // Top highlight rim
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    this.ctx.fillRect(b.x + 2, b.y + 2, Math.max(0, b.width - 4), 2);

    // Block Label
    if (b.width > 55) {
      this.ctx.fillStyle = '#ffffff';
      this.ctx.font = '600 11px system-ui, sans-serif';
      this.ctx.textAlign = 'center';
      this.ctx.textBaseline = 'middle';
      this.ctx.shadowBlur = 0;
      this.ctx.fillText(b.label, b.x + b.width / 2, b.y + b.height / 2 + 1, b.width - 12);
    }

    this.ctx.restore();
  }

  private endGame(): void {
    this.isGameOver.set(true);
    const total = this.stack.length - 1;
    const prec = total > 0 ? Math.min(100, Math.round((this.perfectCount / total) * 100) + 30) : 50;
    this.perfectionScore.set(prec);
  }

  getResultHeading(): string {
    const count = this.stackCount();
    if (count >= 10) return '🚀 Enterprise-Grade Architecture!';
    if (count >= 5) return '⚡ Robust & Production-Ready!';
    return '🌱 Solid Prototype Build!';
  }

  getResultSummary(): string {
    const count = this.stackCount();
    if (count >= 10) {
      return `You constructed a sky-high setup with ${count} modular features. With this stack, Gnana Chandra can ship your high-performance web product effortlessly.`;
    }
    return `You stacked ${count} core features. Ready to see these clean architectures and responsive interfaces built in code?`;
  }

  encodeCTA(type: string): string {
    return encodeURIComponent(`Hey Gnana, I just played your portfolio builder! Let's talk about an Angular opportunity.`);
  }
}