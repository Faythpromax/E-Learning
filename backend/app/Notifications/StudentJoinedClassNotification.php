<?php

namespace App\Notifications;

use App\Models\ClassModel;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class StudentJoinedClassNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly User $student,
        public readonly ClassModel $class
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Học sinh mới tham gia lớp: {$this->class->name}")
            ->greeting("Xin chào, thầy/cô {$notifiable->name}!")
            ->line('Lớp học của thầy/cô vừa có một thành viên mới tham gia.')
            ->line("- Học sinh: {$this->student->name} ({$this->student->email})")
            ->line("- Lớp học: {$this->class->name}")
            ->action('Xem danh sách lớp', url("/classes/{$this->class->id}/students"))
            ->line('Cảm ơn thầy/cô đã đồng hành cùng học sinh!');
    }

    public function toArray(object $notifiable): array
    {
        return [
            'class_id' => $this->class->id,
            'class_name' => $this->class->name,
            'student_id' => $this->student->id,
            'student_name' => $this->student->name,
            'message' => "Học sinh {$this->student->name} đã tham gia lớp học '{$this->class->name}' của bạn.",
            'action_url' => "/classes/{$this->class->id}/students",
            'type' => 'join_class',
        ];
    }
}

