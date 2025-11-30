import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import FamilyTreeBuilder from '@/components/FamilyTreeBuilder';

export default function Index() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <Icon name="Users" size={24} className="text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                РодоДрево
              </h1>
            </div>
            <div className="hidden md:flex space-x-1">
              {['Главная', 'Мои деревья', 'Конструктор', 'Шаблоны', 'Помощь', 'Контакты'].map((item) => (
                <Button
                  key={item}
                  variant={activeTab === item.toLowerCase().replace(' ', '-') ? 'default' : 'ghost'}
                  onClick={() => setActiveTab(item.toLowerCase().replace(' ', '-'))}
                  className="rounded-xl"
                >
                  {item}
                </Button>
              ))}
            </div>
            <Button className="rounded-xl bg-gradient-to-r from-primary to-secondary">
              <Icon name="Plus" size={20} className="mr-2" />
              Создать дерево
            </Button>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="home" className="space-y-8">
            <section className="text-center py-16 animate-fade-in">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Создайте историю вашей семьи
              </h2>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Современный конструктор родословного дерева с безграничными возможностями.
                Добавляйте фотографии, даты и создавайте красивые схемы для печати.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  size="lg"
                  className="rounded-xl bg-gradient-to-r from-primary to-secondary text-lg px-8 py-6"
                  onClick={() => setActiveTab('конструктор')}
                >
                  <Icon name="Sparkles" size={24} className="mr-2" />
                  Начать создание
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-xl text-lg px-8 py-6 border-2"
                  onClick={() => setActiveTab('шаблоны')}
                >
                  <Icon name="Layout" size={24} className="mr-2" />
                  Посмотреть шаблоны
                </Button>
              </div>
            </section>

            <section className="grid md:grid-cols-3 gap-6 animate-fade-in">
              {[
                {
                  icon: 'UserPlus',
                  title: 'Добавляйте родственников',
                  description: 'Интуитивный интерфейс с кнопками: родители, дети, братья, дяди, тети',
                  color: 'from-primary to-purple-600'
                },
                {
                  icon: 'Image',
                  title: 'Загружайте фотографии',
                  description: 'Добавляйте фото, даты рождения и важную информацию о каждом члене семьи',
                  color: 'from-secondary to-blue-600'
                },
                {
                  icon: 'Printer',
                  title: 'Печатайте схему',
                  description: 'Создавайте красивые схемы для печати без ограничений по количеству человек',
                  color: 'from-accent to-orange-600'
                }
              ].map((feature, index) => (
                <Card
                  key={index}
                  className="border-2 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl overflow-hidden"
                >
                  <CardContent className="p-6">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4`}>
                      <Icon name={feature.icon as any} size={28} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </section>

            <section className="bg-white rounded-3xl p-8 shadow-lg animate-fade-in">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">История изменений</h3>
                <Icon name="History" size={28} className="text-primary" />
              </div>
              <p className="text-gray-600 mb-4">
                Все изменения автоматически сохраняются. Вы всегда можете вернуться к предыдущей версии дерева.
              </p>
              <div className="space-y-3">
                {[
                  { time: '2 часа назад', action: 'Добавлен родственник: Иван Петров', icon: 'UserPlus' },
                  { time: '5 часов назад', action: 'Загружено фото для Марии Ивановой', icon: 'Image' },
                  { time: 'Вчера', action: 'Создано новое дерево "Семья Петровых"', icon: 'TreePine' }
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon name={item.icon as any} size={20} className="text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.action}</p>
                      <p className="text-sm text-gray-500">{item.time}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="rounded-lg">
                      <Icon name="RotateCcw" size={16} />
                    </Button>
                  </div>
                ))}
              </div>
            </section>
          </TabsContent>

          <TabsContent value="мои-деревья" className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold">Мои деревья</h2>
              <Button className="rounded-xl bg-gradient-to-r from-primary to-secondary">
                <Icon name="Plus" size={20} className="mr-2" />
                Новое дерево
              </Button>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((item) => (
                <Card
                  key={item}
                  className="border-2 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl overflow-hidden cursor-pointer"
                  onClick={() => setActiveTab('конструктор')}
                >
                  <div className="h-48 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Icon name="Users" size={64} className="text-primary/40" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">Семья Петровых</h3>
                    <p className="text-gray-600 text-sm mb-4">24 члена семьи • Обновлено 2 часа назад</p>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="rounded-lg flex-1">
                        <Icon name="Eye" size={16} className="mr-2" />
                        Открыть
                      </Button>
                      <Button variant="outline" size="sm" className="rounded-lg">
                        <Icon name="MoreVertical" size={16} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="конструктор" className="animate-fade-in">
            <FamilyTreeBuilder />
          </TabsContent>

          <TabsContent value="шаблоны" className="space-y-6 animate-fade-in">
            <h2 className="text-3xl font-bold mb-6">Шаблоны деревьев</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { name: 'Классическое дерево', members: '5-20 человек', icon: 'TreePine' },
                { name: 'Расширенная семья', members: '20-50 человек', icon: 'Users' },
                { name: 'Большой род', members: '50+ человек', icon: 'Network' },
                { name: 'Пустой шаблон', members: 'Начать с нуля', icon: 'FileText' }
              ].map((template, index) => (
                <Card
                  key={index}
                  className="border-2 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl overflow-hidden cursor-pointer"
                  onClick={() => setActiveTab('конструктор')}
                >
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                        <Icon name={template.icon as any} size={32} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{template.name}</h3>
                        <p className="text-gray-600 mb-4">{template.members}</p>
                        <Button className="rounded-xl">
                          <Icon name="ArrowRight" size={16} className="mr-2" />
                          Использовать
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="помощь" className="animate-fade-in">
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="text-3xl font-bold mb-6">Помощь</h2>
              <Card className="rounded-2xl border-2">
                <CardContent className="p-8 space-y-6">
                  {[
                    {
                      q: 'Как добавить родственника?',
                      a: 'В конструкторе нажмите на карточку члена семьи, затем выберите тип родства (родители, дети, братья/сестры, дяди/тети) и заполните данные.'
                    },
                    {
                      q: 'Можно ли загрузить фотографию?',
                      a: 'Да! При добавлении или редактировании родственника нажмите на область аватара и выберите фото с вашего устройства.'
                    },
                    {
                      q: 'Как распечатать дерево?',
                      a: 'Нажмите кнопку "Экспорт" в конструкторе и выберите "Печать". Система автоматически подготовит схему для печати.'
                    },
                    {
                      q: 'Есть ли ограничения по количеству?',
                      a: 'Нет! Вы можете добавить неограниченное количество членов семьи в ваше родословное дерево.'
                    }
                  ].map((item, index) => (
                    <div key={index}>
                      <h3 className="text-lg font-bold mb-2">{item.q}</h3>
                      <p className="text-gray-600">{item.a}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="контакты" className="animate-fade-in">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold mb-6">Контакты</h2>
              <Card className="rounded-2xl border-2">
                <CardContent className="p-8 space-y-6">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon name="Mail" size={40} className="text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">Свяжитесь с нами</h3>
                    <p className="text-gray-600 mb-6">
                      Если у вас есть вопросы или предложения, мы всегда рады помочь!
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center justify-center space-x-3">
                        <Icon name="Mail" size={20} className="text-primary" />
                        <span>info@rododrevo.ru</span>
                      </div>
                      <div className="flex items-center justify-center space-x-3">
                        <Icon name="Phone" size={20} className="text-primary" />
                        <span>+7 (999) 123-45-67</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>© 2024 РодоДрево. Создайте историю вашей семьи.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
