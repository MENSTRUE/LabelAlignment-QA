from io import BytesIO
from PIL import Image
from fastapi.testclient import TestClient
from app.main import create_app

client = TestClient(create_app())

def test_health_and_status():
    response = client.get('/api/v1/health')
    assert response.status_code == 200
    assert 'checkpoint_found' in response.json()['model']
    assert client.get('/api/v1/model').status_code == 200

def test_reject_invalid_image():
    response = client.post('/api/v1/detect', files={'file': ('bad.png', b'not-an-image', 'image/png')})
    assert response.status_code == 415

def test_reject_invalid_threshold():
    response = client.post('/api/v1/detect?confidence=1.5', files={'file': ('x.png', b'test', 'image/png')})
    assert response.status_code == 422

def test_valid_image_requires_real_checkpoint_if_absent():
    if client.app.state.detector.path.exists():
        return
    out = BytesIO()
    Image.new('RGB', (32, 32), 'white').save(out, format='PNG')
    response = client.post('/api/v1/detect', files={'file': ('x.png', out.getvalue(), 'image/png')})
    assert response.status_code == 503
