import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import type { Screen, Difficulty, Blogger, Achievement } from './types';

interface MenuScreensProps {
  screen: Screen;
  coins: number;
  difficulty: Difficulty;
  bloggers: Blogger[];
  achievements: Achievement[];
  setScreen: (screen: Screen) => void;
  setDifficulty: (difficulty: Difficulty) => void;
  startGame: () => void;
  buyBlogger: (bloggerId: string) => void;
}

export const MenuScreens = ({
  screen,
  coins,
  difficulty,
  bloggers,
  achievements,
  setScreen,
  setDifficulty,
  startGame,
  buyBlogger,
}: MenuScreensProps) => {
  return (
    <>
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
    </>
  );
};
