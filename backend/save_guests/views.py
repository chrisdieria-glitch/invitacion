from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

from .models import Attendance

ALLOWED_ATTENDANCE_VALUES = {"yes", "no"}
NAME_MAX_LENGTH = 200


def _origin_is_allowed(request):
    """Sustituye al chequeo de Origin que hacía CsrfViewMiddleware.

    Un navegador siempre manda Origin en un POST cross-site, así que si
    viene y no está en la allowlist, la petición no salió de nuestra web.
    Si no viene, es un cliente que no es un navegador (script, app), que
    podría falsear la cabecera de todas formas: lo dejamos pasar.
    """
    origin = request.headers.get("Origin")
    if not origin:
        return True
    return origin in settings.CORS_ALLOWED_ORIGINS


@csrf_exempt
def api_home(request):
    if request.method != "POST":
        return JsonResponse({"error": "Método no permitido"}, status=405)

    if not _origin_is_allowed(request):
        return JsonResponse({"error": "Origen no permitido."}, status=403)

    try:
        data = json.loads(request.body)
    except (ValueError, TypeError):
        return JsonResponse(
            {"error": "El cuerpo de la solicitud no es JSON válido."},
            status=400,
        )

    if not isinstance(data, dict):
        return JsonResponse(
            {"error": "El cuerpo de la solicitud debe ser un objeto JSON."},
            status=400,
        )

    name = data.get("name")
    attendance = data.get("attendance")

    if name is None or not isinstance(name, str) or not name.strip():
        return JsonResponse(
            {"error": "El nombre es obligatorio.", "field": "name"},
            status=400,
        )

    name = name.strip()

    if len(name) > NAME_MAX_LENGTH:
        return JsonResponse(
            {
                "error": f"El nombre no puede superar los {NAME_MAX_LENGTH} caracteres.",
                "field": "name",
            },
            status=400,
        )

    if attendance not in ALLOWED_ATTENDANCE_VALUES:
        return JsonResponse(
            {
                "error": "La opción de asistencia debe ser 'yes' o 'no'.",
                "field": "attendance",
            },
            status=400,
        )

    record = Attendance.objects.create(
        name=name,
        attendance_confirmation=attendance,
    )

    return JsonResponse(
        {
            "message": "Asistencia registrada",
            "id": record.id,
            "name": record.name,
            "attendance": record.attendance_confirmation,
        },
        status=201,
    )


def csrf(request):
    return JsonResponse({"csrfToken": get_token(request)})