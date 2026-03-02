'use client';

import { useState, useEffect } from 'react';
import {
  Upload,
  File,
  Folder,
  Download,
  Trash2,
  Search,
  Eye,
  Edit,
  Copy,
  Move,
  Share2,
  FileText,
  Image,
  Video,
  Music,
  Archive,
  HardDrive,
  Calendar,
  User,
  MoreHorizontal,
  Grid,
  List,
  Plus,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size: number;
  mimeType: string;
  path: string;
  createdAt: string;
  modifiedAt: string;
  createdBy: string;
  shared: boolean;
}

interface UploadProgress {
  id: string;
  name: string;
  progress: number;
  status: 'uploading' | 'completed' | 'error';
}

export function FileManager() {
  const { toast } = useToast();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');

  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/admin/files?path=${encodeURIComponent(currentPath)}`
      );
      if (response.ok) {
        const data = await response.json();
        setFiles(Array.isArray(data) ? data : []);
      } else {
        setFiles([]);
      }
    } catch (error) {
      console.error('Failed to fetch files:', error);
      setFiles([]);
      toast.error('فشل تحميل قائمة الملفات');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [currentPath]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files || []);
    event.target.value = '';

    for (const file of uploadedFiles) {
      const uploadId = Math.random().toString(36).substring(2, 9);
      setUploadProgress((prev) => [
        ...prev,
        { id: uploadId, name: file.name, progress: 0, status: 'uploading' },
      ]);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('path', currentPath);

      try {
        const response = await fetch('/api/admin/files/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          setUploadProgress((prev) =>
            prev.map((item) =>
              item.id === uploadId
                ? { ...item, progress: 100, status: 'completed' as const }
                : item
            )
          );
          toast.success(`تم رفع الملف: ${file.name}`);
          fetchFiles();
        } else {
          setUploadProgress((prev) =>
            prev.map((item) =>
              item.id === uploadId ? { ...item, status: 'error' as const } : item
            )
          );
          toast.error(`فشل رفع: ${file.name}`);
        }
      } catch (error) {
        setUploadProgress((prev) =>
          prev.map((item) =>
            item.id === uploadId ? { ...item, status: 'error' as const } : item
          )
        );
        toast.error(`فشل رفع: ${file.name}`);
      }
    }
  };

  const handleDeleteFile = async (fileId: string) => {
    try {
      const response = await fetch(`/api/admin/files/${fileId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setFiles((prev) => prev.filter((f) => f.id !== fileId));
        setSelectedFiles((prev) => prev.filter((id) => id !== fileId));
        toast.success('تم حذف الملف');
      } else {
        toast.error('فشل حذف الملف');
      }
    } catch (error) {
      toast.error('فشل حذف الملف');
    }
  };

  const handleDownloadFile = async (fileId: string) => {
    const file = files.find((f) => f.id === fileId);
    try {
      const response = await fetch(`/api/admin/files/${fileId}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file?.name || 'file';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
        toast.success('تم التحميل');
      } else {
        toast.error('فشل تحميل الملف');
      }
    } catch (error) {
      toast.error('فشل تحميل الملف');
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (mimeType.startsWith('video/')) return <Video className="w-4 h-4" />;
    if (mimeType.startsWith('audio/')) return <Music className="w-4 h-4" />;
    if (mimeType.includes('pdf') || mimeType.includes('document'))
      return <FileText className="w-4 h-4" />;
    if (mimeType.includes('zip') || mimeType.includes('rar'))
      return <Archive className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 بايت';
    const k = 1024;
    const sizes = ['بايت', 'ك.ب', 'م.ب', 'ج.ب'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      selectedFilter === 'all' ||
      (selectedFilter === 'file' && file.type === 'file') ||
      (selectedFilter === 'folder' && file.type === 'folder');
    return matchesSearch && matchesFilter;
  });

  const handleSelectFile = (fileId: string) => {
    setSelectedFiles((prev) =>
      prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId]
    );
  };

  const handleSelectAll = () => {
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredFiles.map((f) => f.id));
    }
  };

  const handleBulkDelete = () => {
    selectedFiles.forEach((id) => handleDeleteFile(id));
    setSelectedFiles([]);
  };

  const handleBulkDownload = () => {
    selectedFiles.forEach((id) => handleDownloadFile(id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">مدير الملفات</h3>
          <p className="text-sm text-slate-400">إدارة وتنظيم الملفات والمجلدات</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-slate-600 text-slate-300"
            onClick={() => fetchFiles()}
          >
            <RefreshCw className="w-4 h-4 ml-2" />
            تحديث
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-slate-600 text-slate-300"
            onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
          >
            {viewMode === 'list' ? (
              <Grid className="w-4 h-4" />
            ) : (
              <List className="w-4 h-4" />
            )}
          </Button>
          <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600 hover:bg-indigo-700">
                <Plus className="w-4 h-4 ml-2" />
                رفع ملف
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-800 border-slate-700 text-slate-100">
              <DialogHeader>
                <DialogTitle>رفع ملفات جديدة</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-slate-500" />
                  <p className="text-sm text-slate-400 mb-2">
                    اسحب الملفات هنا أو انقر للاختيار
                  </p>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload-admin"
                  />
                  <label htmlFor="file-upload-admin">
                    <Button
                      type="button"
                      variant="outline"
                      className="cursor-pointer border-slate-600 text-slate-300"
                      onClick={() =>
                        document.getElementById('file-upload-admin')?.click()
                      }
                    >
                      اختيار ملفات
                    </Button>
                  </label>
                </div>
                {uploadProgress.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-slate-300">
                      تقدم الرفع
                    </h4>
                    {uploadProgress.map((upload) => (
                      <div key={upload.id} className="space-y-1">
                        <div className="flex justify-between text-sm text-slate-400">
                          <span>{upload.name}</span>
                          <span>{upload.progress}%</span>
                        </div>
                        <Progress
                          value={upload.progress}
                          className={
                            upload.status === 'error' ? 'bg-red-500/20' : ''
                          }
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex gap-2 text-sm text-slate-400">
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-400"
          onClick={() => setCurrentPath('/')}
        >
          <HardDrive className="w-4 h-4 ml-1" />
          الرئيسية
        </Button>
        {currentPath
          .split('/')
          .filter(Boolean)
          .map((segment, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              className="text-slate-400"
              onClick={() =>
                setCurrentPath(
                  '/' +
                    currentPath
                      .split('/')
                      .filter(Boolean)
                      .slice(0, index + 1)
                      .join('/')
                )
              }
            >
              {segment}
            </Button>
          ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <Input
            placeholder="بحث عن ملفات..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pr-10 bg-slate-900/50 border-slate-600 text-slate-100"
          />
        </div>
        <Select value={selectedFilter} onValueChange={setSelectedFilter}>
          <SelectTrigger className="w-full sm:w-48 bg-slate-900/50 border-slate-600 text-slate-100">
            <SelectValue placeholder="نوع الملف" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الملفات</SelectItem>
            <SelectItem value="file">ملفات</SelectItem>
            <SelectItem value="folder">مجلدات</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {selectedFiles.length > 0 && (
        <div className="flex items-center gap-2 p-3 bg-slate-800 rounded-lg border border-slate-700">
          <span className="text-sm text-slate-300">
            تم تحديد {selectedFiles.length} ملف
          </span>
          <div className="flex gap-2 mr-auto">
            <Button
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300"
              onClick={handleBulkDownload}
            >
              <Download className="w-4 h-4 ml-1" />
              تحميل
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300"
              onClick={() => toast.info('ميزة النقل قريباً')}
            >
              <Move className="w-4 h-4 ml-1" />
              نقل
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-600 text-slate-300"
              onClick={() => toast.info('ميزة النسخ قريباً')}
            >
              <Copy className="w-4 h-4 ml-1" />
              نسخ
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
            >
              <Trash2 className="w-4 h-4 ml-1" />
              حذف
            </Button>
          </div>
        </div>
      )}

      <Card className="bg-slate-800/80 border-slate-700">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center text-slate-400">جاري التحميل...</div>
          ) : filteredFiles.length === 0 ? (
            <div className="p-12 text-center">
              <Folder className="w-16 h-16 mx-auto text-slate-600 mb-4" />
              <p className="text-slate-400 mb-2">لا توجد ملفات في هذا المسار</p>
              <p className="text-sm text-slate-500 mb-4">
                استخدم &quot;رفع ملف&quot; لإضافة ملفات
              </p>
              <Button
                variant="outline"
                className="border-slate-600 text-slate-300"
                onClick={() => setIsUploadDialogOpen(true)}
              >
                <Upload className="w-4 h-4 ml-2" />
                رفع ملف
              </Button>
            </div>
          ) : viewMode === 'list' ? (
            <Table>
              <TableHeader>
                <TableRow className="border-slate-700 hover:bg-transparent">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        filteredFiles.length > 0 &&
                        selectedFiles.length === filteredFiles.length
                      }
                      onCheckedChange={handleSelectAll}
                      className="border-slate-600 data-[state=checked]:bg-indigo-600"
                    />
                  </TableHead>
                  <TableHead className="text-slate-400">الاسم</TableHead>
                  <TableHead className="text-slate-400">الحجم</TableHead>
                  <TableHead className="text-slate-400">النوع</TableHead>
                  <TableHead className="text-slate-400">آخر تعديل</TableHead>
                  <TableHead className="w-12 text-slate-400"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFiles.map((file) => (
                  <TableRow
                    key={file.id}
                    className="border-slate-700 hover:bg-slate-700/30"
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedFiles.includes(file.id)}
                        onCheckedChange={() => handleSelectFile(file.id)}
                        className="border-slate-600 data-[state=checked]:bg-indigo-600"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {file.type === 'folder' ? (
                          <Folder className="w-4 h-4 text-indigo-400" />
                        ) : (
                          getFileIcon(file.mimeType)
                        )}
                        <span className="font-medium text-slate-100">
                          {file.name}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-400">
                      {file.type === 'folder' ? '—' : formatFileSize(file.size)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-slate-600 text-slate-400">
                        {file.type === 'folder' ? 'مجلد' : file.mimeType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-400 text-sm">
                      {new Date(file.modifiedAt).toLocaleDateString('ar-SA')}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-slate-400 hover:text-slate-100"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-slate-800 border-slate-700"
                        >
                          <DropdownMenuItem
                            onClick={() => handleDownloadFile(file.id)}
                            className="text-slate-200"
                          >
                            <Download className="w-4 h-4 ml-2" />
                            تحميل
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => toast.info('معاينة: ' + file.name)}
                            className="text-slate-200"
                          >
                            <Eye className="w-4 h-4 ml-2" />
                            معاينة
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => toast.info('تعديل: ' + file.name)}
                            className="text-slate-200"
                          >
                            <Edit className="w-4 h-4 ml-2" />
                            تعديل
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => toast.info('مشاركة: ' + file.name)}
                            className="text-slate-200"
                          >
                            <Share2 className="w-4 h-4 ml-2" />
                            مشاركة
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteFile(file.id)}
                            className="text-red-400"
                          >
                            <Trash2 className="w-4 h-4 ml-2" />
                            حذف
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className={`border rounded-lg p-4 cursor-pointer hover:bg-slate-700/30 transition-colors ${
                    selectedFiles.includes(file.id)
                      ? 'bg-indigo-500/20 border-indigo-500'
                      : 'border-slate-700'
                  }`}
                  onClick={() => handleSelectFile(file.id)}
                >
                  <div className="flex flex-col items-center text-center">
                    {file.type === 'folder' ? (
                      <Folder className="w-12 h-12 text-indigo-400 mb-2" />
                    ) : (
                      <div className="w-12 h-12 flex items-center justify-center mb-2 text-slate-400">
                        {getFileIcon(file.mimeType)}
                      </div>
                    )}
                    <p className="text-sm font-medium text-slate-100 truncate w-full">
                      {file.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {file.type === 'folder'
                        ? 'مجلد'
                        : formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
