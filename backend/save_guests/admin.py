from django.contrib import admin
from .models import Attendance
@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ("name", "attendance_confirmation")

# Register your models here.
