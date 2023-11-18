# Import the dependencies.
import datetime as dt
import numpy as np
import pandas as pd

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify


#################################################
# Database Setup
#################################################


# create an engine to connect the database
engine = create_engine("sqlite:///hawaii.sqlite", connect_args={'check_same_thread': False})

# reflect an existing database into a new model
Base = automap_base()

# reflect the tables
Base.prepare(autoload_with=engine)

# Save references to each table
Measure = Base.classes.measurement
Station = Base.classes.station

# Create our session (link) from Python to the DB
session = Session(engine)


#################################################
# Flask Setup
#################################################


app = Flask(__name__)


#################################################
# Flask Routes
#################################################


# Question 1: List all the available routes.
@app.route("/")
def welcome():

    return (
        f"All the available routes are:<br/>"
        f"/api/v1.0/precipitation<br/>"
        f"/api/v1.0/stations<br/>"
        f"/api/v1.0/tobs<br/>"
        f"/api/v1.0/start<br/>"
        f"/api/v1.0/start/end<br/>"
    )


# Question 2: /api/v1.0/precipitation
@app.route("/api/v1.0/precipitation")
def precipitation():

    # retrieve only the last 12 months of data
    last_date = session.query(Measure.date).order_by(Measure.date.desc()).first()

    last_year = dt.date(2017, 8, 23) - dt.timedelta(days=365)

    result = session.query(Measure.date, Measure.prcp).filter(Measure.date >= last_year).order_by(Measure.date).all()

    # Convert the query results to a dictionary using date as the key and prcp as the value.
    prepcipit_re = []

    for date, prcp in result:
        precipit_dict = {}
        precipit_dict[date] = prcp
        prepcipit_re.append(precipit_dict)

    return jsonify(prepcipit_re)


# Question 3: /api/v1.0/stations
@app.route("/api/v1.0/stations")
def stations():

    # Return a JSON list of stations from the dataset.
    station = session.query(Station.name, Station.station)

    # Convert the query results to a dictionary.
    station_re = []

    for station, name in station:
        station_dict = {}
        station_dict["station"] = station
        station_dict["name"] = name
        station_re.append(station_dict)

    return jsonify(station_re)


# Question 4: /api/v1.0/tobs
@app.route("/api/v1.0/tobs")
def tobs():

    # Query the dates and temperature observations of the most-active station for the previous year of data.
    last_date = session.query(Measure.date).order_by(Measure.date.desc()).first()

    last_year = dt.date(2017, 8, 23) - dt.timedelta(days=365)

    mostactive_station = session.query(Measure.station).group_by(Measure.station).\
                            order_by(func.count().desc()).first()
    
    (mostactive_station_id, ) = mostactive_station

    temp = session.query(Measure.date, Measure.tobs).filter(Measure.station == mostactive_station_id).filter(Measure.date >= last_year).\
            order_by(Measure.date).all()

    # Convert the query results to a dictionary using date as the key and temperature as the value.
    temp_re = []

    for date, temp in temp:
        temp_dict = {}
        temp_dict[date] = temp
        temp_re.append(temp_dict)

    return jsonify(temp_re)


# Question 5.1: /api/v1.0/<start>
@app.route("/api/v1.0/<start>")
def start_func(start):

    # For a specified start, calculate TMIN, TAVG, and TMAX for all the dates greater than or equal to the start date.

    start_date= dt.datetime.strptime(start, '%Y-%m-%d')

    end_date = dt.date(2017, 8, 23)

    result = session.query(func.min(Measure.tobs), func.avg(Measure.tobs), func.max(Measure.tobs)).\
                filter(Measure.date >= start_date).filter(Measure.date <= end_date).all()

    return jsonify(list(np.ravel(result)))


# Question 5.2: /api/v1.0/<start>/<end>
@app.route("/api/v1.0/<start>/<end>")
def start_end_func(start, end):

    # For a specified start date and end date, calculate TMIN, TAVG, and TMAX for the dates from the start date to the end date.

    start_date= dt.datetime.strptime(start, '%Y-%m-%d')

    end_date= dt.datetime.strptime(end, '%Y-%m-%d')
 
    result = session.query(func.min(Measure.tobs), func.avg(Measure.tobs), func.max(Measure.tobs)).\
                filter(Measure.date >= start_date).filter(Measure.date <= end_date).all()

    return jsonify(list(np.ravel(result)))


if __name__ == "__main__":
    app.run(debug=True)

