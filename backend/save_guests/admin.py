from django.contrib import admin
from .models import Attendance

admin.site.register(Attendance)
@admin.register(Attendance)
class AttendanceAdmin(admin.ModelAdmin):
    list_display = ("name", "attendance")

# Register your models here.
