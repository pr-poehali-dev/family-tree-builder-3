import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
}

export default function FamilyTreeBuilder() {
  const [members, setMembers] = useState<FamilyMember[]>([
    {
      id: '1',
      name: 'Вы',
      birthDate: '1990-01-01',
      relation: 'Я',
      parentIds: [],
    },
  ]);
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newMember, setNewMember] = useState<Partial<FamilyMember>>({});
  const [history, setHistory] = useState<FamilyMember[][]>([members]);
  const [isAlive, setIsAlive] = useState(true);

  const addMember = () => {
    if (!newMember.name || !newMember.birthDate || !newMember.relation) {
      toast.error('Заполните все обязательные поля');
      return;
    }

    let parentIds: string[] = [];
    if (newMember.relation === 'child' && selectedMember) {
      parentIds = [selectedMember.id];
    } else if (newMember.relation === 'sibling') {
      const currentUser = members.find((m) => m.relation === 'Я');
      if (currentUser && currentUser.parentIds) {
        parentIds = currentUser.parentIds;
      }
    } else if (newMember.relation === 'parent') {
      const currentUser = members.find((m) => m.relation === 'Я');
      if (currentUser) {
        const updatedUser = {
          ...currentUser,
          parentIds: [...(currentUser.parentIds || []), Date.now().toString()],
        };
        const updatedMembers = members.map((m) => (m.id === currentUser.id ? updatedUser : m));
        setMembers(updatedMembers);
      }
    }

    const member: FamilyMember = {
      id: newMember.relation === 'parent' ? (members.find((m) => m.relation === 'Я')?.parentIds?.slice(-1)[0] || Date.now().toString()) : Date.now().toString(),
      name: newMember.name,
      birthDate: newMember.birthDate,
      deathDate: isAlive ? undefined : newMember.deathDate,
      photo: newMember.photo,
      relation: newMember.relation,
      parentIds: parentIds,
    };

    if (newMember.relation === 'parent') {
      member.id = Date.now().toString();
      const currentUser = members.find((m) => m.relation === 'Я');
      if (currentUser) {
        const updatedMembers = members.map((m) => {
          if (m.id === currentUser.id) {
            return {
              ...m,
              parentIds: [...(m.parentIds || []), member.id],
            };
          }
          return m;
        });
        const finalMembers = [...updatedMembers, member];
        setMembers(finalMembers);
        setHistory([...history, finalMembers]);
        setIsAddDialogOpen(false);
        setNewMember({});
        setIsAlive(true);
        toast.success(`${member.name} добавлен в дерево`);
        return;
      }
    }

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
                { label: 'Родители', value: 'parent', icon: 'Users' },
                { label: 'Дети', value: 'child', icon: 'Baby' },
                { label: 'Братья/Сестры', value: 'sibling', icon: 'UserPlus' },
                { label: 'Дяди/Тети', value: 'uncle_aunt', icon: 'Users2' },
                { label: 'Бабушки/Дедушки', value: 'grandparent', icon: 'User' },
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
          <Card className="rounded-2xl border-2 min-h-[600px]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold flex items-center">
                  <Icon name="Network" size={20} className="mr-2 text-primary" />
                  Визуализация дерева
                </h3>
                <span className="text-sm text-gray-500">
                  Всего: {members.length} {members.length === 1 ? 'человек' : 'человек'}
                </span>
              </div>

              <div className="space-y-12 relative">
                {['grandparent', 'parent', 'Я', 'sibling', 'uncle_aunt', 'child'].map((level, levelIndex, array) => {
                  const levelMembers = members.filter(
                    (m) => m.relation === level || (level === 'Я' && m.relation === 'Я')
                  );

                  if (levelMembers.length === 0) return null;

                  return (
                    <div key={level} className="relative">
                      <div className="text-sm font-medium text-gray-500 mb-3 uppercase tracking-wide flex items-center">
                        <div className="flex-1">
                          {level === 'grandparent' && 'Бабушки и Дедушки'}
                          {level === 'parent' && 'Родители'}
                          {level === 'Я' && 'Вы'}
                          {level === 'sibling' && 'Братья и Сестры'}
                          {level === 'uncle_aunt' && 'Дяди и Тети'}
                          {level === 'child' && 'Дети'}
                        </div>
                        {levelIndex > 0 && (
                          <div className="h-8 w-0.5 bg-gradient-to-b from-primary/30 to-transparent absolute -top-8 left-1/2 transform -translate-x-1/2" />
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative">
                        {levelMembers.map((member, memberIndex) => {
                          const hasParents = member.parentIds && member.parentIds.length > 0;
                          const parents = hasParents
                            ? members.filter((m) => member.parentIds?.includes(m.id))
                            : [];

                          return (
                            <div key={member.id} className="relative">
                              {parents.length > 0 && (
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex items-center">
                                  <div className="h-8 w-0.5 bg-gradient-to-b from-primary/40 to-primary/20" />
                                  <Icon
                                    name="ArrowDown"
                                    size={16}
                                    className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-primary/40"
                                  />
                                </div>
                              )}
                              <Card
                                className="cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-xl border-2 overflow-hidden bg-white relative"
                                onClick={() => setSelectedMember(member)}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-start space-x-3">
                                    <Avatar className="w-16 h-16 rounded-xl border-2 border-primary/20">
                                      <AvatarImage src={member.photo} />
                                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white rounded-xl text-lg font-bold">
                                        {member.name
                                          .split(' ')
                                          .map((n) => n[0])
                                          .join('')}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div className="flex-1 min-w-0">
                                      <h4 className="font-bold text-lg truncate">{member.name}</h4>
                                      <p className="text-sm text-gray-500">
                                        {new Date(member.birthDate).toLocaleDateString('ru-RU', {
                                          year: 'numeric',
                                        })}
                                        {member.deathDate && (
                                          <>
                                            {' - '}
                                            {new Date(member.deathDate).toLocaleDateString('ru-RU', {
                                              year: 'numeric',
                                            })}
                                          </>
                                        )}
                                      </p>
                                      <div className="mt-2 flex items-center">
                                        <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-lg font-medium">
                                          {member.relation === 'parent' && 'Родитель'}
                                          {member.relation === 'child' && 'Ребенок'}
                                          {member.relation === 'sibling' && 'Брат/Сестра'}
                                          {member.relation === 'uncle_aunt' && 'Дядя/Тетя'}
                                          {member.relation === 'grandparent' && 'Бабушка/Дедушка'}
                                          {member.relation === 'Я' && 'Вы'}
                                        </span>
                                      </div>
                                    </div>
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

              {members.length === 1 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center mb-4">
                    <Icon name="Users" size={48} className="text-primary/40" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">Начните создавать дерево</h3>
                  <p className="text-gray-600 max-w-md">
                    Используйте панель слева, чтобы добавить родственников. Начните с родителей или детей!
                  </p>
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
              <h3 className="font-bold mb-1">Подсказка</h3>
              <p className="text-sm text-gray-600">
                Линии со стрелками показывают связи между поколениями. Если человек жив, дату смерти можно
                не указывать. Нажмите на карточку родственника для просмотра деталей.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
