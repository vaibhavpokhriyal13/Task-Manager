import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { fetchTasks, createTask, updateTask, deleteTask } from '@/lib/api';
import { 
  LogOut, LayoutDashboard, Plus, Star, CheckCircle2, 
  Loader2, Sparkles, Circle, ArrowRightCircle, Trash2, Calendar
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

const Index = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'todo' });

  // Data Fetching
  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: fetchTasks,
    enabled: !!user,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries(['tasks']);
      setIsDialogOpen(false);
      setNewTask({ title: '', description: '', status: 'todo' });
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateTask(id, data),
    onSuccess: () => queryClient.invalidateQueries(['tasks'])
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => queryClient.invalidateQueries(['tasks'])
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden flex flex-col items-center justify-center p-4">
        {/* Dynamic Background Elements */}
        <div className="absolute top-[10%] left-[10%] w-[30%] h-[30%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] rounded-full bg-pink-500/20 blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center z-10 max-w-3xl mx-auto px-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md mx-auto">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-white/80">The future of productivity</span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight mb-8 text-gradient leading-tight pb-2">
            Master your workflow.
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
            Organize, prioritize, and conquer your tasks with a stunningly beautiful interface designed for maximum efficiency.
          </p>

          <Link to="/auth">
            <Button size="lg" className="h-14 px-8 text-lg bg-primary hover:bg-primary/90 text-white rounded-2xl shadow-[0_0_40px_rgba(103,58,255,0.4)] hover:scale-105 transition-all">
              Start for free
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  const handleCreateTask = (e) => {
    e.preventDefault();
    createMutation.mutate(newTask);
  };

  const handleStatusToggle = (task) => {
    const nextStatus = {
      'todo': 'in-progress',
      'in-progress': 'completed',
      'completed': 'todo'
    }[task.status];
    
    updateMutation.mutate({ id: task._id, data: { status: nextStatus } });
  };

  const StatusIcon = ({ status }) => {
    if (status === 'completed') return <CheckCircle2 className="w-6 h-6 text-green-500" />;
    if (status === 'in-progress') return <ArrowRightCircle className="w-6 h-6 text-yellow-500" />;
    return <Circle className="w-6 h-6 text-muted-foreground hover:text-primary transition-colors" />;
  };

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/30">
      {/* Subtle Background Elements */}
      <div className="absolute top-0 left-1/4 w-[50%] h-[20%] rounded-full bg-primary/10 blur-[120px] pointer-events-none fixed" />

      {/* Floating Navbar */}
      <nav className="fixed top-0 w-full z-50 p-4 sm:p-6">
        <div className="container mx-auto max-w-5xl">
          <div className="glass rounded-2xl px-6 py-4 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-pink-500 flex items-center justify-center shadow-lg shadow-primary/20">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold tracking-tight hidden sm:block">Task Manager</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-white/80 font-medium">
                  {user.display_name || user.email}
                </span>
              </div>
              
              <Button variant="ghost" size="icon" className="rounded-xl hover:bg-white/10" onClick={signOut}>
                <LogOut className="w-5 h-5 text-muted-foreground hover:text-white transition-colors" />
              </Button>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Main Content Area */}
      <main className="pt-36 sm:pt-44 pb-20 container mx-auto px-4 sm:px-6 max-w-5xl relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 sm:mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl sm:text-5xl font-bold mb-3 tracking-tight text-white">My Tasks</h2>
            <p className="text-muted-foreground text-lg">You're doing great. Keep up the momentum!</p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="h-12 px-6 rounded-xl bg-white text-black hover:bg-white/90 font-semibold shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:scale-105 transition-all">
                  <Plus className="w-5 h-5 mr-2" />
                  New Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] glass border-white/10 text-white !rounded-3xl p-6 sm:p-8">
                <DialogHeader className="mb-6">
                  <DialogTitle className="text-2xl font-bold">Create new task</DialogTitle>
                  <DialogDescription className="text-white/60 text-base">
                    Add the details below to keep track of your work.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleCreateTask} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-white/80">Task Title</Label>
                    <Input 
                      id="title" 
                      value={newTask.title}
                      onChange={e => setNewTask({...newTask, title: e.target.value})}
                      className="bg-black/20 border-white/10 h-11 focus-visible:ring-primary"
                      placeholder="e.g., Review project proposal"
                      required
                      autoFocus
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-white/80">Description (Optional)</Label>
                    <Textarea 
                      id="description" 
                      value={newTask.description}
                      onChange={e => setNewTask({...newTask, description: e.target.value})}
                      className="bg-black/20 border-white/10 resize-none focus-visible:ring-primary h-24"
                      placeholder="Add any extra details here..."
                    />
                  </div>
                  <Button type="submit" disabled={createMutation.isPending} className="w-full h-11 bg-primary hover:bg-primary/90 rounded-xl shadow-[0_0_20px_rgba(103,58,255,0.4)]">
                    {createMutation.isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Task"}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>

        {/* Task List */}
        {tasksLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary/50" />
          </div>
        ) : tasks.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card rounded-3xl p-12 sm:p-20 text-center relative overflow-hidden mt-8"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-[80px]" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 shadow-xl">
                <Star className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-3xl font-bold mb-4 text-white">You're all caught up!</h3>
              <p className="text-white/60 max-w-md mx-auto mb-8 text-lg">
                There are currently no tasks assigned to you. Enjoy your free time or create a new task to get started.
              </p>
              <Button onClick={() => setIsDialogOpen(true)} variant="outline" className="h-12 px-6 rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium">
                <Plus className="w-5 h-5 mr-2 text-primary" />
                Add your first task
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            className="space-y-4"
            initial="hidden"
            animate="show"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
          >
            <AnimatePresence mode="popLayout">
              {tasks.map((task) => (
                <motion.div
                  key={task._id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  className={`group relative glass rounded-2xl p-5 sm:p-6 transition-all duration-300 border-l-4 hover:bg-white/[0.03] ${
                    task.status === 'completed' ? 'border-l-green-500 opacity-60 hover:opacity-100' :
                    task.status === 'in-progress' ? 'border-l-yellow-500' :
                    'border-l-primary'
                  }`}
                >
                  <div className="flex items-start gap-4 sm:gap-6">
                    <button 
                      onClick={() => handleStatusToggle(task)}
                      className="mt-1 flex-shrink-0 active:scale-90 transition-transform"
                    >
                      <StatusIcon status={task.status} />
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className={`text-lg sm:text-xl font-semibold mb-2 text-white truncate transition-all duration-300 ${task.status === 'completed' ? 'line-through text-white/50' : ''}`}>
                        {task.title}
                      </h4>
                      {task.description && (
                        <p className={`text-white/60 text-sm sm:text-base leading-relaxed line-clamp-2 ${task.status === 'completed' ? 'line-through' : ''}`}>
                          {task.description}
                        </p>
                      )}
                      <div className="mt-4 flex items-center gap-4 text-xs font-medium text-white/40">
                        <span className="flex items-center gap-1.5 uppercase tracking-wider">
                          <span className={`w-2 h-2 rounded-full ${
                            task.status === 'completed' ? 'bg-green-500' :
                            task.status === 'in-progress' ? 'bg-yellow-500' : 'bg-primary'
                          }`} />
                          {task.status.replace('-', ' ')}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(task.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={() => deleteMutation.mutate(task._id)}
                      className="flex-shrink-0 opacity-0 group-hover:opacity-100 p-2 sm:p-3 hover:bg-destructive/20 text-destructive rounded-xl transition-all active:scale-95"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Index;