import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  quotes(): string {
    const quotes = [
      "Go ahead, take the apples to Eurystheus. I'll keep holding up the sky... and your data.",
      "I will bear the sky of your data on my shoulders for eternity.",
      "Would you be willing to trade me your data for some apples?",
    ];
    return this.random(quotes);
  }
  private random(quotes: string[]) {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    return quotes[randomIndex];
  }
  ping(): string {
    return 'Pong!';
  }
  health(): any {
    return {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
    };
  }
}
