import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface FamilyMember {
  id: string;
  name: string;
  birthDate: string;
  deathDate?: string;
  photo?: string;
  relation: string;
  parentIds?: string[];
  level: number;
  x?: number;
}

export default function FamilyTreeBuilder() {
  const [members, setMembers] = useState<FamilyMember[]>([
    {
      id: '1',
      name: 'Вы',
      birthDate: '1990-01-01',
      relation: 'Я',
      parentIds: [],
      level: 2,
      x: 0,
    },
  ]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newMember, setNewMember] = useState<Partial<FamilyMember>>({});
  const [history, setHistory] = useState<FamilyMember[][]>([members]);
  const [isAlive, setIsAlive] = useState(true);

  const addMember = () => {
    if (!newMember.name || !newMember.birthDate || !newMember.relation) {
      toast.error('Заполните все обязательные поля');
      return;
    }

    let level = 2;
    let parentIds: string[] = [];

    if (newMember.relation === 'grandparent') {
      level = 0;
    } else if (newMember.relation === 'parent') {
      level = 1;
      const currentUser = members.find((m) => m.relation === 'Я');
      if (currentUser) {
        const memberId = Date.now().toString();
        parentIds = [];
        const updatedMembers = members.map((m) => {
          if (m.id === currentUser.id) {
            return { ...m, parentIds: [...(m.parentIds || []), memberId] };
          }
          return m;
        });
        const member: FamilyMember = {
          id: memberId,
          name: newMember.name,
          birthDate: newMember.birthDate,
          deathDate: isAlive ? undefined : newMember.deathDate,
          photo: newMember.photo,
          relation: newMember.relation,
          parentIds: parentIds,
          level: level,
        };
        const finalMembers = [...updatedMembers, member];
        setMembers(finalMembers);
        setHistory([...history, finalMembers]);
        setIsAddDialogOpen(false);
        setNewMember({});
        setIsAlive(true);
        toast.success(`${member.name} добавлен в дерево`);
        return;
      }
    } else if (newMember.relation === 'Я') {
      level = 2;
    } else if (newMember.relation === 'sibling') {
      level = 2;
      const currentUser = members.find((m) => m.relation === 'Я');
      if (currentUser && currentUser.parentIds) {
        parentIds = currentUser.parentIds;
      }
    } else if (newMember.relation === 'child') {
      level = 3;
      const currentUser = members.find((m) => m.relation === 'Я');
      if (currentUser) {
        parentIds = [currentUser.id];
      }
    }

    const member: FamilyMember = {
      id: Date.now().toString(),
      name: newMember.name,
      birthDate: newMember.birthDate,
      deathDate: isAlive ? undefined : newMember.deathDate,
      photo: newMember.photo,
      relation: newMember.relation,
      parentIds: parentIds,
      level: level,
    };

    const updatedMembers = [...members, member];
    setMembers(updatedMembers);
    setHistory([...history, updatedMembers]);
    setIsAddDialogOpen(false);
    setNewMember({});
    setIsAlive(true);
    toast.success(`${member.name} добавлен в дерево`);
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

  const renderConnections = (member: FamilyMember, memberIndex: number, levelMembers: FamilyMember[]) => {
    if (!member.parentIds || member.parentIds.length === 0) return null;

    return member.parentIds.map((parentId) => {
      const parent = members.find((m) => m.id === parentId);
      if (!parent) return null;

      const parentLevelMembers = getLevelMembers(parent.level);
      const parentIndex = parentLevelMembers.findIndex((m) => m.id === parentId);

      return (
        <line
          key={`${parentId}-${member.id}`}
          x1={`${parentIndex * 33.33 + 16.66}%`}
          y1="0%"
          x2={`${memberIndex * 33.33 + 16.66}%`}
          y2="100%"
          stroke="#8B5CF6"
          strokeWidth="3"
          opacity="0.4"
          markerEnd="url(#arrowhead)"
        />
      );
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold mb-2">Конструктор родословного дерева</h2>
          <p className="text-gray-600">Добавляйте родственников и создавайте визуальную схему</p>
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
            <div className="space-y-2">
              {[
                { label: 'Бабушки/Дедушки', value: 'grandparent', icon: 'User' },
                { label: 'Родители', value: 'parent', icon: 'Users' },
                { label: 'Братья/Сестры', value: 'sibling', icon: 'UserPlus' },
                { label: 'Дети', value: 'child', icon: 'Baby' },
              ].map((rel) => (
                <Dialog
                  key={rel.value}
                  open={isAddDialogOpen && newMember.relation === rel.value}
                  onOpenChange={(open) => {
                    setIsAddDialogOpen(open);
                    if (open) setNewMember({ relation: rel.value });
                    if (!open) setIsAlive(true);
                  }}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start rounded-xl"
                      onClick={() => {
                        setNewMember({ relation: rel.value });
                        setIsAddDialogOpen(true);
                        setIsAlive(true);
                      }}
                    >
                      <Icon name={rel.icon as any} size={18} className="mr-2" />
                      {rel.label}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="rounded-2xl">
                    <DialogHeader>
                      <DialogTitle>Добавить: {rel.label}</DialogTitle>
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
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-3">
          <Card
            className="rounded-2xl border-2 min-h-[700px] overflow-auto"
            style={{
              backgroundImage: 'url(https://cdn.poehali.dev/files/6f1d5a9d-51f4-4283-badf-63c830b23d31.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundBlendMode: 'soft-light',
              backgroundColor: 'rgba(255, 255, 255, 0.92)',
            }}
          >
            <CardContent className="p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold flex items-center text-lg">
                  <Icon name="Network" size={20} className="mr-2 text-primary" />
                  Визуализация дерева
                </h3>
                <span className="text-sm text-gray-600 bg-white/80 px-3 py-1 rounded-lg">
                  Всего: {members.length} {members.length === 1 ? 'человек' : 'человек'}
                </span>
              </div>

              {members.length === 1 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4">
                    <Icon name="Users" size={48} className="text-primary/40" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Начните создавать дерево</h3>
                  <p className="text-gray-600 max-w-md">
                    Используйте панель слева, чтобы добавить родственников. Начните с родителей или детей!
                  </p>
                </div>
              ) : (
                <div className="relative space-y-20">
                  {[0, 1, 2, 3].map((level, levelIdx, arr) => {
                    const levelMembers = getLevelMembers(level);
                    if (levelMembers.length === 0) return null;

                    return (
                      <div key={level} className="relative">
                        <div className="text-center mb-6">
                          <span className="inline-block bg-white/90 px-4 py-2 rounded-xl border-2 border-primary/20 font-bold text-sm uppercase tracking-wide text-gray-700 shadow-sm">
                            {level === 0 && 'Бабушки и Дедушки'}
                            {level === 1 && 'Родители'}
                            {level === 2 && 'Вы и Братья/Сестры'}
                            {level === 3 && 'Дети'}
                          </span>
                        </div>

                        <div className="relative">
                          {levelIdx > 0 && (
                            <svg
                              className="absolute -top-16 left-0 w-full h-16 pointer-events-none"
                              style={{ zIndex: 1 }}
                            >
                              <defs>
                                <marker
                                  id="arrowhead"
                                  markerWidth="10"
                                  markerHeight="10"
                                  refX="9"
                                  refY="3"
                                  orient="auto"
                                >
                                  <polygon points="0 0, 10 3, 0 6" fill="#8B5CF6" opacity="0.5" />
                                </marker>
                              </defs>
                              {levelMembers.map((member, memberIndex) =>
                                renderConnections(member, memberIndex, levelMembers)
                              )}
                            </svg>
                          )}

                          <div
                            className="grid gap-6 relative"
                            style={{
                              gridTemplateColumns: `repeat(${Math.max(levelMembers.length, 3)}, minmax(200px, 1fr))`,
                              zIndex: 2,
                            }}
                          >
                            {levelMembers.map((member) => {
                              const birthYear = new Date(member.birthDate).getFullYear();
                              const deathYear = member.deathDate
                                ? new Date(member.deathDate).getFullYear()
                                : null;

                              return (
                                <div
                                  key={member.id}
                                  className="flex flex-col items-center relative animate-scale-in"
                                >
                                  <div
                                    className="relative w-full max-w-[200px] h-[180px] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer border-4 border-amber-200"
                                    style={{
                                      background:
                                        'linear-gradient(135deg, rgba(245, 232, 199, 0.95) 0%, rgba(222, 184, 135, 0.95) 100%)',
                                      backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M10 10 Q 20 5, 30 10 T 50 10' stroke='%23CD853F' fill='none' opacity='0.2'/%3E%3C/svg%3E")`,
                                    }}
                                  >
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center mb-2 border-2 border-amber-300 shadow-md">
                                        <span className="text-white font-bold text-lg">
                                          {member.name
                                            .split(' ')
                                            .map((n) => n[0])
                                            .join('')}
                                        </span>
                                      </div>
                                      <h4 className="font-bold text-gray-800 text-sm leading-tight mb-1">
                                        {member.name}
                                      </h4>
                                      <p className="text-xs text-gray-700 font-medium">
                                        {birthYear}
                                        {deathYear && ` - ${deathYear}`}
                                      </p>
                                      <div className="mt-2">
                                        <span className="inline-block text-[10px] px-2 py-0.5 bg-amber-700/20 text-amber-900 rounded-md font-medium">
                                          {member.relation === 'parent' && 'Родитель'}
                                          {member.relation === 'child' && 'Ребенок'}
                                          {member.relation === 'sibling' && 'Брат/Сестра'}
                                          {member.relation === 'grandparent' && 'Бабушка/Дедушка'}
                                          {member.relation === 'Я' && 'Вы'}
                                        </span>
                                      </div>
                                    </div>

                                    <div
                                      className="absolute top-2 left-2 w-6 h-6"
                                      style={{
                                        backgroundImage:
                                          'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 24 24\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M12 2 L8 8 L2 9 L7 14 L6 20 L12 17 L18 20 L17 14 L22 9 L16 8 Z\' fill=\'%23CD853F\' opacity=\'0.3\'/%3E%3C/svg%3E")',
                                        backgroundSize: 'contain',
                                      }}
                                    />
                                    <div
                                      className="absolute bottom-2 right-2 w-6 h-6"
                                      style={{
                                        backgroundImage:
                                          'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 24 24\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M12 2 L8 8 L2 9 L7 14 L6 20 L12 17 L18 20 L17 14 L22 9 L16 8 Z\' fill=\'%23CD853F\' opacity=\'0.3\'/%3E%3C/svg%3E")',
                                        backgroundSize: 'contain',
                                      }}
                                    />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
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

      <Card className="rounded-2xl border-2 bg-gradient-to-r from-amber-50 to-orange-50">
        <CardContent className="p-6">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
              <Icon name="Info" size={24} className="text-amber-600" />
            </div>
            <div>
              <h3 className="font-bold mb-1">Винтажный стиль дерева</h3>
              <p className="text-sm text-gray-600">
                Карточки оформлены в стиле старинных свитков с декоративными элементами. Линии показывают
                родственные связи между поколениями. Нажмите "Экспорт" для печати!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
