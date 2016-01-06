__author__ = 'asia'

from mongoengine import *
import lib.mongoLeankit
import lib.excel
import datetime

def _initMongoConn ():
    connect('leankit')

if __name__ == '__main__':
    _initMongoConn ()

    excelReport = lib.excel.ExcelReport(datetime.datetime.now().strftime("Status_%Y-%m-%d-%H-%M-%S.xlsx"),
                         "Portfolio DreamLab")
    excelReport.initReport()

    teams = lib.mongoLeankit.Team.objects().order_by('location_name', 'name')
    for team in teams:
        cards = lib.mongoLeankit.Card.objects(Q(board_title='PMO Portfolio Kanban Teams')
                                      & Q(board_masterlane_title='Current development plan')
                                      & Q(team_name=team.name)).order_by('title')
        if len(cards) > 0:
            excelReport.writeTeam(team)
            for card in cards:
                excelReport.writeCard(card)
            excelReport.laneBreak()

    excelReport.close()