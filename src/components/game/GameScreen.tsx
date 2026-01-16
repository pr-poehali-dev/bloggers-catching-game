import { RefObject } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import type { Screen, Difficulty, FallingBlogger, Blogger } from './types';
import { difficultySettings } from './types';

interface GameScreenProps {
  screen: Screen;
  gameRef: RefObject<HTMLDivElement>;
  score: number;
  timeLeft: number;
  fallingBloggers: FallingBlogger[];
  difficulty: Difficulty;
  selectedBlogger: string;
  bloggers: Blogger[];
  coins: number;
  setScreen: (screen: Screen) => void;
  setIsPaused: (isPaused: boolean) => void;
  setSelectedBlogger: (id: string) => void;
  catchBlogger: (id: string) => void;
  endGame: () => void;
  formatTime: (seconds: number) => string;
}

export const GameScreen = ({
  screen,
  gameRef,
  score,
  timeLeft,
  fallingBloggers,
  difficulty,
  selectedBlogger,
  bloggers,
  coins,
  setScreen,
  setIsPaused,
  setSelectedBlogger,
  catchBlogger,
  endGame,
  formatTime,
}: GameScreenProps) => {
  return (
    <>
      {screen === 'game' && (
        <div ref={gameRef} className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-game-blue/20 to-game-purple/20">
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
            <div className="flex gap-4">
              <Card className="px-6 py-3 bg-white/90 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <Icon name="Star" className="text-game-orange" />
                  <span className="text-2xl font-bold">{score}</span>
                </div>
              </Card>
              
              <Card className="px-6 py-3 bg-white/90 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                  <Icon name="Clock" className="text-game-purple" />
                  <span className="text-2xl font-bold">{formatTime(timeLeft)}</span>
                </div>
              </Card>
            </div>

            <Button
              size="lg"
              variant="secondary"
              onClick={() => {
                setIsPaused(true);
                setScreen('pause');
              }}
            >
              <Icon name="Pause" size={24} />
            </Button>
          </div>

          {fallingBloggers.map((blogger) => (
            <div
              key={blogger.id}
              className="absolute cursor-pointer hover:scale-110 transition-transform"
              style={{
                left: `${blogger.x}px`,
                top: `${blogger.y}px`,
                transform: `rotate(${blogger.rotation}deg)`,
              }}
              onClick={() => catchBlogger(blogger.id)}
            >
              <img
                src={blogger.image}
                alt="Blogger"
                className="w-20 h-20 rounded-full border-4 border-white shadow-xl"
              />
            </div>
          ))}
        </div>
      )}

      {screen === 'pause' && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-bounce-in">
          <Card className="p-8 max-w-md w-full mx-4">
            <h2 className="text-4xl font-heading font-bold text-center mb-8 text-game-purple">
              Пауза
            </h2>
            
            <div className="space-y-4">
              <Button
                size="lg"
                className="w-full text-xl"
                onClick={() => {
                  setIsPaused(false);
                  setScreen('game');
                }}
              >
                <Icon name="Play" className="mr-2" />
                Продолжить
              </Button>

              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-3">Сменить блогера:</p>
                <div className="grid grid-cols-4 gap-2">
                  {bloggers
                    .filter((b) => b.unlocked)
                    .map((blogger) => (
                      <button
                        key={blogger.id}
                        className={`p-2 rounded-lg border-2 transition-all ${
                          selectedBlogger === blogger.id
                            ? 'border-game-purple scale-110'
                            : 'border-transparent hover:border-game-purple/50'
                        }`}
                        onClick={() => setSelectedBlogger(blogger.id)}
                      >
                        <img
                          src={blogger.image}
                          alt={blogger.name}
                          className="w-full aspect-square rounded-full"
                        />
                      </button>
                    ))}
                </div>
              </div>

              <Button
                size="lg"
                variant="outline"
                className="w-full text-xl"
                onClick={() => {
                  endGame();
                  setScreen('menu');
                }}
              >
                <Icon name="Home" className="mr-2" />
                Выйти в меню
              </Button>
            </div>
          </Card>
        </div>
      )}

      {screen === 'gameOver' && (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 animate-bounce-in">
          <h2 className="text-6xl font-heading font-bold text-game-purple mb-4">
            Игра окончена!
          </h2>
          
          <Card className="p-8 max-w-md w-full mb-8">
            <div className="text-center space-y-4">
              <div>
                <p className="text-muted-foreground mb-2">Поймано блогеров</p>
                <p className="text-5xl font-bold text-game-purple">{score}</p>
              </div>
              
              <div>
                <p className="text-muted-foreground mb-2">Заработано монет</p>
                <p className="text-4xl font-bold text-game-orange">
                  +{Math.floor(score * difficultySettings[difficulty].multiplier)}
                </p>
              </div>

              <div className="pt-4 border-t">
                <p className="text-muted-foreground mb-2">Всего монет</p>
                <div className="flex items-center justify-center gap-2">
                  <Icon name="Coins" className="text-game-orange" size={32} />
                  <p className="text-3xl font-bold text-game-purple">{coins}</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="flex gap-4">
            <Button size="lg" onClick={() => setScreen('difficulty')} className="text-xl">
              <Icon name="RotateCcw" className="mr-2" />
              Играть снова
            </Button>
            <Button size="lg" variant="outline" onClick={() => setScreen('menu')} className="text-xl">
              <Icon name="Home" className="mr-2" />
              В меню
            </Button>
          </div>
        </div>
      )}
    </>
  );
};
