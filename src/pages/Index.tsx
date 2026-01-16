import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { MenuScreens } from '@/components/game/MenuScreens';
import { GameScreen } from '@/components/game/GameScreen';
import type { Screen, Difficulty, Blogger, FallingBlogger, Achievement } from '@/components/game/types';
import { difficultySettings } from '@/components/game/types';

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
      <MenuScreens
        screen={screen}
        coins={coins}
        difficulty={difficulty}
        bloggers={bloggers}
        achievements={achievements}
        setScreen={setScreen}
        setDifficulty={setDifficulty}
        startGame={startGame}
        buyBlogger={buyBlogger}
      />
      <GameScreen
        screen={screen}
        gameRef={gameRef}
        score={score}
        timeLeft={timeLeft}
        fallingBloggers={fallingBloggers}
        difficulty={difficulty}
        selectedBlogger={selectedBlogger}
        bloggers={bloggers}
        coins={coins}
        setScreen={setScreen}
        setIsPaused={setIsPaused}
        setSelectedBlogger={setSelectedBlogger}
        catchBlogger={catchBlogger}
        endGame={endGame}
        formatTime={formatTime}
      />
    </div>
  );
};

export default Index;
