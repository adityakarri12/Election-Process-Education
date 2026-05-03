import logging
import sys
from logging.handlers import RotatingFileHandler
from pythonjsonlogger import jsonlogger

def setup_logging():
    """
    Configures an enterprise-grade structured logging system.
    Outputs to both Console (Human-readable) and File (JSON-structured).
    """
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)

    # Console Handler - Human Readable
    console_handler = logging.StreamHandler(sys.stdout)
    console_formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    console_handler.setFormatter(console_formatter)
    logger.addHandler(console_handler)

    # File Handler - Structured JSON for production monitoring
    file_handler = RotatingFileHandler(
        'app.log', maxBytes=10485760, backupCount=5
    )
    json_formatter = jsonlogger.JsonFormatter(
        '%(asctime)s %(name)s %(levelname)s %(message)s'
    )
    file_handler.setFormatter(json_formatter)
    logger.addHandler(file_handler)

    logging.info("Platform Intelligence Logging System Initialized.")
