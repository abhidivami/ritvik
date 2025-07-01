"""Top-level package for ritvik."""

__all__ = [
    '__version__',
    '__author__',
    '__email__',
    'cli',
    'health',
]

__author__ = """Abhilash Adunuri"""
__email__ = 'abhilashadunuri@divami.com'
__version__ = '0.1.0'

from .__pre_init__ import cli
from . import health