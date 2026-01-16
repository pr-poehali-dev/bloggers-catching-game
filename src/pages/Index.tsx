import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

type Screen = 'menu' | 'shop' | 'difficulty' | 'game' | 'pause' | 'achievements' | 'gameOver';
type Difficulty = 'easy' | 'normal' | 'hard';

interface Blogger {
  id: string;
  name: string;
  image: string;
  price: number;
  unlocked: boolean;
}

interface FallingBlogger {
  id: string;
  bloggerId: string;
  x: number;
  y: number;
  speed: number;
  rotation: number;
  image: string;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  requirement: number;
  progress: number;
}

const Index = () => {
  const [screen, setScreen] = useState<Screen>('menu');
  const [coins, setCoins] = useState(0);
  const [score, setScore] = useState(0);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [selectedBlogger, setSelectedBlogger] = useState<string>('glent');
  const [timeLeft, setTimeLeft] = useState(300);
  const [isPaused, setIsPaused] = useState(false);
  const [fallingBloggers, setFallingBloggers] = useState<FallingBlogger[]>([]);
  const gameRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const spawnRef = useRef<NodeJS.Timeout | null>(null);

  const [bloggers, setBloggers] = useState<Blogger[]>([
    {
      id: 'glent',
      name: 'ГЛЕНТ',
      image: 'https://cdn.poehali.dev/projects/5fd5751d-cd8f-4b3f-946b-6b20a89e9f07/files/12136555-62c6-45fc-9ccc-8dfdc32e9a1e.jpg',
      price: 0,
      unlocked: true,
    },
    {
      id: 'techbro',
      name: 'ТехБро',
      image: 'https://cdn.poehali.dev/projects/5fd5751d-cd8f-4b3f-946b-6b20a89e9f07/files/12136555-62c6-45fc-9ccc-8dfdc32e9a1e.jpg',
      price: 500,
      unlocked: false,
    },
    {
      id: 'gamer',
      name: 'ГеймерПро',
      image: 'https://cdn.poehali.dev/projects/5fd5751d-cd8f-4b3f-946b-6b20a89e9f07/files/12136555-62c6-45fc-9ccc-8dfdc32e9a1e.jpg',
      price: 1000,
      unlocked: false,
    },
    {
      id: 'foodie',
      name: 'ФудиКинг',
      image: 'https://cdn.poehali.dev/projects/5fd5751d-cd8f-4b3f-946b-6b20a89e9f07/files/12136555-62c6-45fc-9ccc-8dfdc32e9a1e.jpg',
      price: 1500,
      unlocked: false,
    },
  ]);

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 'first-catch',
      name: 'Первый улов',
      description: 'Поймай первого блогера',
      icon: 'Star',
      unlocked: false,
      requirement: 1,
      progress: 0,
    },
    {
      id: 'speedster',
      name: 'Скоростной',
      description: 'Поймай 50 блогеров за игру',
      icon: 'Zap',
      unlocked: false,
      requirement: 50,
      progress: 0,
    },
    {
      id: 'collector',
      name: 'Коллекционер',
      description: 'Открой всех блогеров',
      icon: 'Award',
      unlocked: false,
      requirement: 4,
      progress: 1,
    },
    {
      id: 'rich',
      name: 'Богач',
      description: 'Накопи 5000 монет',
      icon: 'Coins',
      unlocked: false,
      requirement: 5000,
      progress: 0,
    },
  ]);

  const difficultySettings = {
    easy: { speed: 2, spawnRate: 1500, multiplier: 1 },
    normal: { speed: 3.5, spawnRate: 1000, multiplier: 1.5 },
    hard: { speed: 5, spawnRate: 700, multiplier: 2 },
  };

  const startGame = () => {
    setScreen('game');
    setScore(0);
    setTimeLeft(300);
    setFallingBloggers([]);
    setIsPaused(false);
    
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    spawnBlogger();
  };

  const spawnBlogger = () => {
    if (spawnRef.current) clearInterval(spawnRef.current);
    
    spawnRef.current = setInterval(() => {
      if (isPaused) return;
      
      const unlockedBloggers = bloggers.filter((b) => b.unlocked);
      const randomBlogger = unlockedBloggers[Math.floor(Math.random() * unlockedBloggers.length)];
      
      const newBlogger: FallingBlogger = {
        id: Math.random().toString(36),
        bloggerId: randomBlogger.id,
        x: Math.random() * (window.innerWidth - 80),
        y: -100,
        speed: difficultySettings[difficulty].speed,
        rotation: Math.random() * 360,
        image: randomBlogger.image,
      };

      setFallingBloggers((prev) => [...prev, newBlogger]);
    }, difficultySettings[difficulty].spawnRate);
  };

  const endGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (spawnRef.current) clearInterval(spawnRef.current);
    
    const earnedCoins = Math.floor(score * difficultySettings[difficulty].multiplier);
    setCoins((prev) => prev + earnedCoins);
    
    updateAchievements(score, earnedCoins);
    
    setScreen('gameOver');
    toast.success(`Игра окончена! Заработано ${earnedCoins} монет 🎉`);
  };

  const updateAchievements = (finalScore: number, earnedCoins: number) => {
    setAchievements((prev) =>
      prev.map((ach) => {
        let newProgress = ach.progress;
        
        if (ach.id === 'first-catch' && finalScore > 0) {
          newProgress = Math.max(newProgress, 1);
        } else if (ach.id === 'speedster') {
          newProgress = Math.max(newProgress, finalScore);
        } else if (ach.id === 'collector') {
          newProgress = bloggers.filter((b) => b.unlocked).length;
        } else if (ach.id === 'rich') {
          newProgress = coins + earnedCoins;
        }
        
        const unlocked = newProgress >= ach.requirement;
        
        if (unlocked && !ach.unlocked) {
          toast.success(`🏆 Достижение разблокировано: ${ach.name}!`);
        }
        
        return { ...ach, progress: newProgress, unlocked };
      })
    );
  };

  const catchBlogger = (id: string) => {
    setFallingBloggers((prev) => prev.filter((b) => b.id !== id));
    setScore((prev) => prev + 1);
    toast.success('+1', { duration: 500 });
  };

  const buyBlogger = (bloggerId: string) => {
    const blogger = bloggers.find((b) => b.id === bloggerId);
    if (!blogger || blogger.unlocked || coins < blogger.price) return;

    setCoins((prev) => prev - blogger.price);
    setBloggers((prev) =>
      prev.map((b) => (b.id === bloggerId ? { ...b, unlocked: true } : b))
    );
    toast.success(`${blogger.name} разблокирован! 🎉`);
  };

  useEffect(() => {
    if (screen !== 'game' || isPaused) return;

    const interval = setInterval(() => {
      setFallingBloggers((prev) =>
        prev
          .map((blogger) => ({
            ...blogger,
            y: blogger.y + blogger.speed,
            rotation: blogger.rotation + 2,
          }))
          .filter((blogger) => blogger.y < window.innerHeight)
      );
    }, 16);

    return () => clearInterval(interval);
  }, [screen, isPaused]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (spawnRef.current) clearInterval(spawnRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {screen === 'menu' && (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 animate-bounce-in">
          <h1 className="text-7xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-game-purple to-game-magenta mb-4 drop-shadow-lg">
            🎮 Ловля Блогеров
          </h1>
          <p className="text-xl text-muted-foreground mb-12">Поймай их всех!</p>
          
          <div className="flex flex-col gap-4 w-full max-w-md">
            <Button
              size="lg"
              className="text-2xl py-8 bg-gradient-to-r from-game-purple to-game-magenta hover:scale-105 transition-transform shadow-xl animate-pulse-glow"
              onClick={() => setScreen('difficulty')}
            >
              <Icon name="Play" className="mr-3" size={32} />
              Играть
            </Button>
            
            <Button
              size="lg"
              variant="secondary"
              className="text-2xl py-8 hover:scale-105 transition-transform shadow-xl"
              onClick={() => setScreen('shop')}
            >
              <Icon name="ShoppingBag" className="mr-3" size={32} />
              Магазин
            </Button>
            
            <Button
              size="lg"
              variant="outline"
              className="text-2xl py-8 hover:scale-105 transition-transform shadow-xl"
              onClick={() => setScreen('achievements')}
            >
              <Icon name="Award" className="mr-3" size={32} />
              Достижения
            </Button>
          </div>

          <div className="mt-8 flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
            <Icon name="Coins" className="text-game-orange" size={28} />
            <span className="text-2xl font-bold text-game-purple">{coins}</span>
          </div>
        </div>
      )}

      {screen === 'difficulty' && (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 animate-slide-up">
          <h2 className="text-5xl font-heading font-bold text-game-purple mb-12">
            Выбери сложность
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-8">
            <Card
              className={`p-8 cursor-pointer hover:scale-105 transition-all ${
                difficulty === 'easy' ? 'ring-4 ring-game-green shadow-2xl' : ''
              }`}
              onClick={() => setDifficulty('easy')}
            >
              <div className="text-center">
                <Icon name="Smile" className="mx-auto mb-4 text-game-green" size={64} />
                <h3 className="text-2xl font-bold mb-2">Лёгкий</h3>
                <p className="text-muted-foreground">Для новичков</p>
                <Badge className="mt-4" variant="secondary">x1 монеты</Badge>
              </div>
            </Card>

            <Card
              className={`p-8 cursor-pointer hover:scale-105 transition-all ${
                difficulty === 'normal' ? 'ring-4 ring-game-orange shadow-2xl' : ''
              }`}
              onClick={() => setDifficulty('normal')}
            >
              <div className="text-center">
                <Icon name="Zap" className="mx-auto mb-4 text-game-orange" size={64} />
                <h3 className="text-2xl font-bold mb-2">Нормальный</h3>
                <p className="text-muted-foreground">Для опытных</p>
                <Badge className="mt-4" variant="secondary">x1.5 монеты</Badge>
              </div>
            </Card>

            <Card
              className={`p-8 cursor-pointer hover:scale-105 transition-all ${
                difficulty === 'hard' ? 'ring-4 ring-destructive shadow-2xl' : ''
              }`}
              onClick={() => setDifficulty('hard')}
            >
              <div className="text-center">
                <Icon name="Flame" className="mx-auto mb-4 text-destructive" size={64} />
                <h3 className="text-2xl font-bold mb-2">Сложный</h3>
                <p className="text-muted-foreground">Для профи</p>
                <Badge className="mt-4" variant="destructive">x2 монеты</Badge>
              </div>
            </Card>
          </div>

          <div className="flex gap-4">
            <Button size="lg" onClick={startGame} className="text-xl px-8">
              <Icon name="Play" className="mr-2" />
              Начать игру
            </Button>
            <Button size="lg" variant="outline" onClick={() => setScreen('menu')}>
              <Icon name="ArrowLeft" className="mr-2" />
              Назад
            </Button>
          </div>
        </div>
      )}

      {screen === 'shop' && (
        <div className="flex flex-col items-center min-h-screen p-8 animate-slide-up">
          <div className="w-full max-w-6xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-5xl font-heading font-bold text-game-purple">
                Магазин блогеров
              </h2>
              <div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
                <Icon name="Coins" className="text-game-orange" size={28} />
                <span className="text-2xl font-bold text-game-purple">{coins}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {bloggers.map((blogger) => (
                <Card
                  key={blogger.id}
                  className={`p-6 hover:scale-105 transition-transform ${
                    blogger.unlocked ? 'bg-gradient-to-br from-game-green/20 to-game-blue/20' : ''
                  }`}
                >
                  <img
                    src={blogger.image}
                    alt={blogger.name}
                    className="w-32 h-32 mx-auto rounded-full mb-4 border-4 border-white shadow-lg"
                  />
                  <h3 className="text-xl font-bold text-center mb-2">{blogger.name}</h3>
                  
                  {blogger.unlocked ? (
                    <Badge className="w-full justify-center" variant="secondary">
                      <Icon name="CheckCircle" className="mr-2" size={16} />
                      Разблокирован
                    </Badge>
                  ) : (
                    <Button
                      className="w-full"
                      onClick={() => buyBlogger(blogger.id)}
                      disabled={coins < blogger.price}
                    >
                      <Icon name="Coins" className="mr-2" />
                      {blogger.price}
                    </Button>
                  )}
                </Card>
              ))}
            </div>

            <Button size="lg" variant="outline" onClick={() => setScreen('menu')}>
              <Icon name="ArrowLeft" className="mr-2" />
              Назад в меню
            </Button>
          </div>
        </div>
      )}

      {screen === 'achievements' && (
        <div className="flex flex-col items-center min-h-screen p-8 animate-slide-up">
          <div className="w-full max-w-4xl">
            <h2 className="text-5xl font-heading font-bold text-game-purple mb-12 text-center">
              🏆 Достижения
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {achievements.map((achievement) => (
                <Card
                  key={achievement.id}
                  className={`p-6 ${
                    achievement.unlocked
                      ? 'bg-gradient-to-br from-game-purple/20 to-game-magenta/20 border-game-purple'
                      : 'opacity-60'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-4 rounded-full ${
                        achievement.unlocked ? 'bg-game-purple text-white' : 'bg-muted'
                      }`}
                    >
                      <Icon name={achievement.icon as any} size={32} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-1">{achievement.name}</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        {achievement.description}
                      </p>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Прогресс</span>
                          <span className="font-bold">
                            {achievement.progress} / {achievement.requirement}
                          </span>
                        </div>
                        <Progress
                          value={(achievement.progress / achievement.requirement) * 100}
                          className="h-2"
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Button size="lg" variant="outline" onClick={() => setScreen('menu')} className="w-full">
              <Icon name="ArrowLeft" className="mr-2" />
              Назад в меню
            </Button>
          </div>
        </div>
      )}

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
    </div>
  );
};

export default Index;
