<?php

namespace App\Notifications;

use App\Models\Test;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewTestAssignedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly Test $test
    ) {}

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        $subjectName = $this->test->subject->name ?? 'Môn học mới';
        return (new MailMessage)
            ->subject("Bài kiểm tra mới: {$this->test->title}")
            ->greeting("Xin chào, {$notifiable->name}!")
            ->line("Một bài kiểm tra mới đã được giáo viên giao cho lớp học của bạn.")
            ->line("Thông tin bài kiểm tra:")
            ->line("- Tiêu đề: {$this->test->title}")
            ->line("- Môn học: {$subjectName}")
            ->line("- Thời lượng: " . ($this->test->duration ? "{$this->test->duration} phút" : "Không giới hạn"))
            ->action('Làm bài ngay', url("/tests/{$this->test->id}"))
            ->line('Chúc bạn ôn tập và làm bài thi đạt kết quả tốt!');
    }

    public function toArray(object $notifiable): array
    {
        $subjectName = $this->test->subject->name ?? 'Môn học mới';
        return [
            'test_id' => $this->test->id,
            'title' => $this->test->title,
            'subject_name' => $subjectName,
            'duration' => $this->test->duration,
            'message' => "Bài kiểm tra mới '{$this->test->title}' môn {$subjectName} đã được giao cho lớp của bạn.",
            'action_url' => "/tests/{$this->test->id}",
        ];
    }
}
