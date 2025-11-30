import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface FamilyMember {
  id: string;
  name: string;
  birthDate: string;
  deathDate?: string;
  photo?: string;
  level: number;
  parentIds?: string[];
  spouseId?: string;
}

export default function FamilyTreeBuilder() {
  const [members, setMembers] = useState<FamilyMember[]>([
    {
      id: '1',
      name: 'Вы',
      birthDate: '1990-01-01',
      level: 3,
      parentIds: [],
    },
  ]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newMember, setNewMember] = useState<Partial<FamilyMember>>({});
  const [selectedParent, setSelectedParent] = useState<string>('');
  const [history, setHistory] = useState<FamilyMember[][]>([members]);
  const [isAlive, setIsAlive] = useState(true);

  const addMember = () => {
    if (!newMember.name || !newMember.birthDate || newMember.level === undefined) {
      toast.error('Заполните все обязательные поля');
      return;
    }

    let parentIds: string[] = [];
    
    if (selectedParent && selectedParent !== 'none') {
      parentIds = [selectedParent];
      
      const parent = members.find(m => m.id === selectedParent);
      if (parent?.spouseId) {
        parentIds.push(parent.spouseId);
      }
    }

    const member: FamilyMember = {
      id: Date.now().toString(),
      name: newMember.name,
      birthDate: newMember.birthDate,
      deathDate: isAlive ? undefined : newMember.deathDate,
      photo: newMember.photo,
      level: newMember.level,
      parentIds: parentIds,
    };

    const updatedMembers = [...members, member];
    setMembers(updatedMembers);
    setHistory([...history, updatedMembers]);
    setIsAddDialogOpen(false);
    setNewMember({});
    setSelectedParent('');
    setIsAlive(true);
    toast.success(`${member.name} добавлен в дерево`);
  };

  const addSpouse = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    if (!member) return;

    const spouseName = prompt('Имя супруга/супруги:');
    if (!spouseName) return;

    const spouse: FamilyMember = {
      id: Date.now().toString(),
      name: spouseName,
      birthDate: member.birthDate,
      level: member.level,
      parentIds: [],
    };

    const updatedMembers = members.map(m => {
      if (m.id === memberId) {
        return { ...m, spouseId: spouse.id };
      }
      return m;
    });

    setMembers([...updatedMembers, spouse]);
    setHistory([...history, [...updatedMembers, spouse]]);
    toast.success(`${spouseName} добавлен как супруг`);
  };

  const undoLastChange = () => {
    if (history.length > 1) {
      const newHistory = history.slice(0, -1);
      setHistory(newHistory);
      setMembers(newHistory[newHistory.length - 1]);
      toast.success('Изменение отменено');
    }
  };

  const exportTree = () => {
    toast.success('Дерево готово к печати!');
  };

  const getLevelMembers = (level: number) => {
    return members.filter((m) => m.level === level);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Конструктор родословного дерева</h2>
          <p className="text-gray-600">Добавляйте родственников по поколениям</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={undoLastChange}
            disabled={history.length <= 1}
            className="rounded-xl"
          >
            <Icon name="RotateCcw" size={20} className="mr-2" />
            Отменить ({history.length - 1})
          </Button>
          <Button onClick={exportTree} className="rounded-xl bg-gradient-to-r from-primary to-secondary">
            <Icon name="Printer" size={20} className="mr-2" />
            Экспорт
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <Card className="md:col-span-1 rounded-2xl border-2">
          <CardContent className="p-6">
            <h3 className="font-bold mb-4 flex items-center">
              <Icon name="UserPlus" size={20} className="mr-2 text-primary" />
              Добавить родственника
            </h3>
            
            <Dialog open={isAddDialogOpen} onOpenChange={(open) => {
              setIsAddDialogOpen(open);
              if (!open) {
                setIsAlive(true);
                setNewMember({});
                setSelectedParent('');
              }
            }}>
              <DialogTrigger asChild>
                <Button
                  variant="default"
                  className="w-full rounded-xl bg-gradient-to-r from-primary to-secondary mb-4"
                  onClick={() => {
                    setNewMember({});
                    setIsAddDialogOpen(true);
                    setIsAlive(true);
                  }}
                >
                  <Icon name="Plus" size={18} className="mr-2" />
                  Добавить члена семьи
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-2xl max-w-md">
                <DialogHeader>
                  <DialogTitle>Добавить члена семьи</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Имя и Фамилия *</Label>
                    <Input
                      id="name"
                      placeholder="Иван Петров"
                      value={newMember.name || ''}
                      onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                  <div>
                    <Label htmlFor="level">Поколение *</Label>
                    <Select
                      value={newMember.level?.toString() || ''}
                      onValueChange={(value) => setNewMember({ ...newMember, level: parseInt(value) })}
                    >
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Выберите поколение" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Прапрадедушки/Прапрабабушки</SelectItem>
                        <SelectItem value="1">Прадедушки/Прабабушки</SelectItem>
                        <SelectItem value="2">Дедушки/Бабушки</SelectItem>
                        <SelectItem value="3">Родители</SelectItem>
                        <SelectItem value="4">Вы и братья/сестры</SelectItem>
                        <SelectItem value="5">Дети</SelectItem>
                        <SelectItem value="6">Внуки</SelectItem>
                        <SelectItem value="7">Правнуки</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {newMember.level !== undefined && newMember.level > 0 && (
                    <div>
                      <Label htmlFor="parent">Родитель (необязательно)</Label>
                      <Select value={selectedParent} onValueChange={setSelectedParent}>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Выберите родителя" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Без родителя</SelectItem>
                          {members
                            .filter((m) => m.level === (newMember.level || 0) - 1)
                            .map((m) => (
                              <SelectItem key={m.id} value={m.id}>
                                {m.name}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div>
                    <Label htmlFor="birthDate">Дата рождения *</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      value={newMember.birthDate || ''}
                      onChange={(e) => setNewMember({ ...newMember, birthDate: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isAlive"
                      checked={isAlive}
                      onCheckedChange={(checked) => setIsAlive(checked as boolean)}
                    />
                    <Label htmlFor="isAlive" className="cursor-pointer">
                      Человек жив
                    </Label>
                  </div>
                  {!isAlive && (
                    <div>
                      <Label htmlFor="deathDate">Дата смерти</Label>
                      <Input
                        id="deathDate"
                        type="date"
                        value={newMember.deathDate || ''}
                        onChange={(e) => setNewMember({ ...newMember, deathDate: e.target.value })}
                        className="rounded-xl"
                      />
                    </div>
                  )}
                  <div>
                    <Label htmlFor="photo">Фотография (URL)</Label>
                    <Input
                      id="photo"
                      placeholder="https://example.com/photo.jpg"
                      value={newMember.photo || ''}
                      onChange={(e) => setNewMember({ ...newMember, photo: e.target.value })}
                      className="rounded-xl"
                    />
                  </div>
                  <Button onClick={addMember} className="w-full rounded-xl">
                    <Icon name="Plus" size={20} className="mr-2" />
                    Добавить в дерево
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <div className="space-y-2 text-sm text-gray-600">
              <p className="font-medium">Подсказка:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Выберите поколение для нового члена</li>
                <li>Укажите родителя для связи</li>
                <li>Без ограничений по количеству</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-3">
          <Card className="rounded-2xl border-2 min-h-[700px] overflow-auto bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold flex items-center text-lg">
                  <Icon name="Network" size={20} className="mr-2 text-primary" />
                  Визуализация дерева
                </h3>
                <span className="text-sm text-gray-600 bg-white/80 px-3 py-1 rounded-lg">
                  Всего: {members.length} человек
                </span>
              </div>

              {members.length === 1 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4">
                    <Icon name="Users" size={48} className="text-primary/40" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Начните создавать дерево</h3>
                  <p className="text-gray-600 max-w-md">
                    Нажмите "Добавить члена семьи" слева и выберите поколение для нового родственника
                  </p>
                </div>
              ) : (
                <div className="space-y-32 relative min-h-[600px]">
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((level) => {
                    const levelMembers = getLevelMembers(level);
                    if (levelMembers.length === 0) return null;

                    const prevLevelMembers = level > 0 ? getLevelMembers(level - 1) : [];

                    return (
                      <div key={level} className="relative">
                        <div className="text-center mb-8">
                          <span className="inline-block bg-white px-4 py-2 rounded-xl border-2 border-primary/30 font-bold text-xs uppercase tracking-wide text-gray-700 shadow-sm">
                            {level === 0 && 'Прапрадеды'}
                            {level === 1 && 'Прадеды'}
                            {level === 2 && 'Дедушки и Бабушки'}
                            {level === 3 && 'Родители'}
                            {level === 4 && 'Вы и Братья/Сестры'}
                            {level === 5 && 'Дети'}
                            {level === 6 && 'Внуки'}
                            {level === 7 && 'Правнуки'}
                          </span>
                        </div>

                        {level > 0 && prevLevelMembers.length > 0 && (
                          <svg
                            className="absolute -top-28 left-0 w-full h-28 pointer-events-none overflow-visible"
                            style={{ zIndex: 0 }}
                          >
                            {levelMembers.map((child, childIdx) => {
                              if (!child.parentIds || child.parentIds.length === 0) return null;

                              return child.parentIds.map((parentId) => {
                                const parent = members.find((m) => m.id === parentId);
                                if (!parent || parent.level !== level - 1) return null;

                                const parentIdx = prevLevelMembers.findIndex((m) => m.id === parentId);
                                if (parentIdx === -1) return null;

                                const childX = ((childIdx + 0.5) / levelMembers.length) * 100;
                                const parentX = ((parentIdx + 0.5) / prevLevelMembers.length) * 100;

                                const midY = 50;

                                return (
                                  <g key={`${parentId}-${child.id}`}>
                                    <path
                                      d={`M ${parentX}% 0 L ${parentX}% ${midY}% L ${childX}% ${midY}% L ${childX}% 100%`}
                                      stroke="#8B5CF6"
                                      strokeWidth="2.5"
                                      fill="none"
                                      opacity="0.5"
                                    />
                                    <circle
                                      cx={`${childX}%`}
                                      cy="100%"
                                      r="4"
                                      fill="#8B5CF6"
                                      opacity="0.7"
                                    />
                                    <circle
                                      cx={`${parentX}%`}
                                      cy="0%"
                                      r="4"
                                      fill="#8B5CF6"
                                      opacity="0.7"
                                    />
                                  </g>
                                );
                              });
                            })}
                          </svg>
                        )}

                        <div
                          className="grid gap-6 relative"
                          style={{
                            gridTemplateColumns: `repeat(${Math.max(levelMembers.length, 1)}, minmax(180px, 1fr))`,
                            zIndex: 1,
                          }}
                        >
                          {levelMembers.map((member) => {
                            const birthYear = new Date(member.birthDate).getFullYear();
                            const deathYear = member.deathDate
                              ? new Date(member.deathDate).getFullYear()
                              : null;

                            return (
                              <div key={member.id} className="flex flex-col items-center">
                                <Card className="w-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-xl border-2 bg-white">
                                  <CardContent className="p-4">
                                    <div className="text-center">
                                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-3 border-2 border-white shadow-md">
                                        {member.photo ? (
                                          <img
                                            src={member.photo}
                                            alt={member.name}
                                            className="w-full h-full rounded-full object-cover"
                                          />
                                        ) : (
                                          <span className="text-white font-bold text-lg">
                                            {member.name
                                              .split(' ')
                                              .map((n) => n[0])
                                              .join('')}
                                          </span>
                                        )}
                                      </div>
                                      <h4 className="font-bold text-sm leading-tight mb-1 px-1">
                                        {member.name}
                                      </h4>
                                      <p className="text-xs text-gray-600 mb-2">
                                        {birthYear}
                                        {deathYear && ` - ${deathYear}`}
                                      </p>
                                      <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-7 px-2 text-xs w-full"
                                        onClick={() => addSpouse(member.id)}
                                      >
                                        <Icon name="Heart" size={12} className="mr-1" />
                                        Добавить супруга
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="rounded-2xl border-2 bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Icon name="Info" size={24} className="text-primary" />
            </div>
            <div>
              <h3 className="font-bold mb-1">Как пользоваться</h3>
              <p className="text-sm text-gray-600">
                Выберите поколение (от прапрадедов до правнуков) и укажите родителя для автоматического создания связей. Линии показывают родственные связи между поколениями. Можно добавлять неограниченное количество родственников!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
