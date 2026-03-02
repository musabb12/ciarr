'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Bot, 
  Send, 
  MessageCircle, 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Zap,
  Brain,
  Target,
  BarChart3,
  FileText,
  Database,
  Shield,
  Settings
} from 'lucide-react';

interface AIMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  category?: 'analysis' | 'recommendation' | 'alert' | 'insight';
  confidence?: number;
  data?: any;
}

interface AIInsight {
  id: string;
  title: string;
  description: string;
  type: 'opportunity' | 'risk' | 'trend' | 'optimization';
  impact: 'high' | 'medium' | 'low';
  actionable: boolean;
  timestamp: string;
}

export function AIAssistant() {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'مرحباً! أنا مساعدك الذكي. لقد قمت بتحليل بيانات النظام ووجدت بعض النقاط المهمة:',
      timestamp: new Date().toISOString(),
      category: 'analysis'
    },
    {
      id: '2',
      type: 'assistant',
      content: '📈 زيادة بنسبة 23% في معدل التحويل خلال الأسبوع الماضي. يوصى بالاستثمار في القنوات الناجحة.',
      timestamp: new Date().toISOString(),
      category: 'insight',
      confidence: 0.89
    },
    {
      id: '3',
      type: 'assistant',
      content: '⚠️ استخدام المعالج تجاوز 85% لمدة 30 دقيقة. يوصى بمراجعة العمليات المكثفة.',
      timestamp: new Date().toISOString(),
      category: 'alert',
      confidence: 0.95
    }
  ]);

  const [insights, setInsights] = useState<AIInsight[]>([
    {
      id: '1',
      title: 'فرصة تحسين المبيعات',
      description: 'العملاء من السعودية يظهرون اهتماماً متزايداً بالمنتجات المميزة. يوصى بتخصيص عروض لهم.',
      type: 'opportunity',
      impact: 'high',
      actionable: true,
      timestamp: new Date().toISOString()
    },
    {
      id: '2',
      title: 'نمط استخدام غير عادي',
      description: 'تم اكتشاف زيادة مفاجئة في طلبات API من منطقة جغرافية غير معتادة.',
      type: 'risk',
      impact: 'medium',
      actionable: true,
      timestamp: new Date().toISOString()
    },
    {
      id: '3',
      title: 'اتجاه إيجابي',
      description: 'معدل التفاعل مع المحتوى الجديد يزداد بنسبة 45% مقارنة بالشهر الماضي.',
      type: 'trend',
      impact: 'medium',
      actionable: false,
      timestamp: new Date().toISOString()
    }
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: AIMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: AIMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateAIResponse(inputMessage),
        timestamp: new Date().toISOString(),
        category: 'insight',
        confidence: Math.random() * 0.3 + 0.7
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const generateAIResponse = (userInput: string) => {
    const responses = [
      'بناءً على تحليل البيانات، أرى أن هناك فرصة لتحسين الأداء بنسبة 15% من خلال تحسين استعلامات قاعدة البيانات.',
      'لقد لاحظت نمطاً مثيراً للاهتمام في سلوك المستخدمين. معدل التفاعل يزداد خلال ساعات الذروة.',
      'يوصى بإجراء تحليل أعمق للبيانات التاريخية لتحديد الاتجاهات الموسمية.',
      'النظام يعمل بكفاءة عالية، ولكن هناك مجال لتحسين استهلاك الذاكرة.',
      'بناءً على المقاييس الحالية، توقع زيادة في حركة المرور بنسبة 20% خلال الأسبوع القادم.'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity':
        return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'risk':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'trend':
        return <BarChart3 className="w-4 h-4 text-blue-600" />;
      case 'optimization':
        return <Zap className="w-4 h-4 text-yellow-600" />;
      default:
        return <Lightbulb className="w-4 h-4 text-gray-600" />;
    }
  };

  const getImpactBadge = (impact: string) => {
    const variants = {
      high: 'destructive',
      medium: 'default',
      low: 'secondary'
    } as const;

    const labels = {
      high: 'عالي',
      medium: 'متوسط',
      low: 'منخفض'
    };

    return <Badge variant={variants[impact as keyof typeof variants]}>{labels[impact as keyof typeof labels]}</Badge>;
  };

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case 'analysis':
        return <BarChart3 className="w-4 h-4 text-blue-600" />;
      case 'recommendation':
        return <Lightbulb className="w-4 h-4 text-yellow-600" />;
      case 'alert':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'insight':
        return <Brain className="w-4 h-4 text-purple-600" />;
      default:
        return <Bot className="w-4 h-4 text-gray-600" />;
    }
  };

  const filteredInsights = insights.filter(insight => 
    selectedCategory === 'all' || insight.type === selectedCategory
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3 space-x-reverse">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">المساعد الذكي</h2>
            <p className="text-sm text-gray-600">تحليلات وتوصيات ذكية للنظام</p>
          </div>
        </div>
        <Badge variant="outline" className="bg-green-100 text-green-800">
          نشط
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                محادثة ذكية
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 pr-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.type === 'user' ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.type === 'user'
                            ? 'bg-blue-100 text-blue-900'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <div className="flex items-start gap-2 space-x-reverse">
                          {message.type === 'assistant' && (
                            <div className="mt-1">
                              {getCategoryIcon(message.category)}
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="text-sm">{message.content}</p>
                            {message.confidence && (
                              <div className="flex items-center gap-2 mt-2">
                                <div className="text-xs text-gray-500">
                                  الثقة: {(message.confidence * 100).toFixed(0)}%
                                </div>
                                <div className="flex-1 bg-gray-200 rounded-full h-1">
                                  <div
                                    className="bg-blue-500 h-1 rounded-full"
                                    style={{ width: `${message.confidence * 100}%` }}
                                  />
                                </div>
                              </div>
                            )}
                            <div className="text-xs text-gray-500 mt-1">
                              {new Date(message.timestamp).toLocaleTimeString('ar-SA')}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex justify-end">
                      <div className="bg-gray-100 text-gray-900 rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <Bot className="w-4 h-4" />
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              <Separator className="my-4" />
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="اسأل المساعد الذكي..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isTyping}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                رؤى ذكية
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {filteredInsights.map((insight) => (
                  <div key={insight.id} className="p-3 border rounded-lg">
                    <div className="flex items-start gap-2 space-x-reverse">
                      <div className="mt-1">
                        {getInsightIcon(insight.type)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{insight.title}</h4>
                        <p className="text-xs text-gray-600 mt-1">{insight.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          {getImpactBadge(insight.impact)}
                          {insight.actionable && (
                            <Badge variant="outline" className="text-xs">
                              قابل للتنفيذ
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">إجراءات سريعة</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="w-4 h-4 ml-2" />
                تحليل الأداء
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Target className="w-4 h-4 ml-2" />
                تحديد الأهداف
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 ml-2" />
                إنشاء تقرير
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Database className="w-4 h-4 ml-2" />
                تحليل البيانات
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Shield className="w-4 h-4 ml-2" />
                فحص الأمان
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}