__author__ = 'asia'

from mongoengine import *
import lib.mongoLeankit
import lib.excel
import datetime

def _initMongoConn ():
    connect('leankit')

if __name__ == '__main__':
    _initMongoConn()

    excelReport = lib.excel.ExcelReport(datetime.datetime.now().strftime("Status_%Y-%m-%d-%H-%M-%S.xlsx"),
                         "Portfolio DreamLab")
    excelReport.initReport()

    last_sponsor = "Not defined"
    sum_in_progress = 0
    sum_total = 0
    # teams = lib.mongoLeankit.Team.objects().order_by('location', 'name')
    # for team in teams:

    cards = lib.mongoLeankit.Card.objects(Q(board_title='PMO Portfolio Kanban Teams')
                                  & Q(board_masterlane_title='Current development plan')).order_by('extended_data__sponsor_name')
    if len(cards) > 0:
        for card in cards:
            if card.extended_data.sponsor_name != last_sponsor:
                last_sponsor = card.extended_data.sponsor_name
                excelReport.laneBreak()
                excelReport.writeSponsor(last_sponsor)
            excelReport.writeCard(card)
            if card.taskboard_completed_card_size is not None:
                sum_in_progress += card.taskboard_completed_card_size
            if card.taskboard_total_size is not None:
                sum_total += card.taskboard_total_size
        excelReport.writeSummary(sum_in_progress, sum_total)

    data = excelReport.close()

    # print("Report generated, saving to database...")
    report = lib.mongoLeankit.Report()

    report.xls_data = data
    report.generation_date = datetime.datetime.now()

    report.save()
    exit(0)
    # print("done.")
